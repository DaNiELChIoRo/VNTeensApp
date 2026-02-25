import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth, signInWithEmail, signInWithGoogle, signOut, registerWithEmail } from '../firebase/auth'
import { createUserDoc, getUserDoc } from '../services/userService'
import { UserRole } from '../types'

interface AuthContextValue {
  currentUser: User | null
  userRole: UserRole | null
  loading: boolean
  loginWithEmail: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        // Ensure a Firestore doc exists for every auth method (email, Google, etc.)
        await createUserDoc(user.uid, {
          displayName: user.displayName ?? user.email ?? 'Unknown',
          email: user.email ?? '',
          photoURL: user.photoURL,
        })
        const profile = await getUserDoc(user.uid)
        setUserRole(profile?.role ?? 'user')
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmail(email, password)
  }

  const loginWithGoogle = async () => {
    const cred = await signInWithGoogle()
    await createUserDoc(cred.user.uid, {
      displayName: cred.user.displayName ?? 'Unknown',
      email: cred.user.email ?? '',
      photoURL: cred.user.photoURL,
    })
  }

  const register = async (email: string, password: string, displayName: string) => {
    const cred = await registerWithEmail(email, password, displayName)
    await createUserDoc(cred.user.uid, {
      displayName,
      email,
      photoURL: null,
    })
  }

  const logout = () => signOut()

  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading, loginWithEmail, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
