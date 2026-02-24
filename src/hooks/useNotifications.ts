import { useEffect } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { subscribeToNotifications } from '../services/notificationService'
import { AppNotification } from '../types'
import { useAuth } from './useAuth'

const QUERY_KEY = 'notifications'

export const useNotifications = () => {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!currentUser) return
    const unsub = subscribeToNotifications(currentUser.uid, (items) => {
      queryClient.setQueryData([QUERY_KEY], items)
    })
    return unsub
  }, [currentUser, queryClient])

  const query = useQuery<AppNotification[]>({
    queryKey: [QUERY_KEY],
    queryFn: () => [],
    staleTime: Infinity,
    initialData: [],
  })

  const unreadCount = query.data.filter((n) => !n.read).length

  return { ...query, unreadCount }
}
