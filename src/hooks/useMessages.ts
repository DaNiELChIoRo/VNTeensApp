import { useEffect } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { subscribeToMessages, subscribeToAllMessages } from '../services/messageService'
import { Message } from '../types'
import { useAuth } from './useAuth'

const QUERY_KEY = 'messages'

export const useMessages = () => {
  const { currentUser, userRole } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!currentUser) return

    const isManager = userRole === 'manager'
    const unsub = isManager
      ? subscribeToAllMessages((msgs) => {
          queryClient.setQueryData([QUERY_KEY], msgs)
        })
      : subscribeToMessages(currentUser.uid, (msgs) => {
          queryClient.setQueryData([QUERY_KEY], msgs)
        })

    return unsub
  }, [currentUser, userRole, queryClient])

  return useQuery<Message[]>({
    queryKey: [QUERY_KEY],
    queryFn: () => [],
    staleTime: Infinity,
    initialData: [],
  })
}
