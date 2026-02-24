import { useEffect } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { subscribeToAllEvents, subscribeToUserEvents } from '../services/eventService'
import { AppEvent } from '../types'
import { useAuth } from './useAuth'

const QUERY_KEY = 'events'

export const useEvents = () => {
  const { currentUser, userRole } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!currentUser) return

    const isManager = userRole === 'manager'
    const unsub = isManager
      ? subscribeToAllEvents((events) => {
          queryClient.setQueryData([QUERY_KEY], events)
        })
      : subscribeToUserEvents(currentUser.uid, (events) => {
          queryClient.setQueryData([QUERY_KEY], events)
        })

    return unsub
  }, [currentUser, userRole, queryClient])

  return useQuery<AppEvent[]>({
    queryKey: [QUERY_KEY],
    queryFn: () => [],
    staleTime: Infinity,
    initialData: [],
  })
}
