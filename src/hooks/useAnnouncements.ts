import { useEffect } from 'react'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { subscribeToAnnouncements } from '../services/announcementService'
import { Announcement } from '../types'

const QUERY_KEY = 'announcements'

export const useAnnouncements = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsub = subscribeToAnnouncements((items) => {
      queryClient.setQueryData([QUERY_KEY], items)
    })
    return unsub
  }, [queryClient])

  return useQuery<Announcement[]>({
    queryKey: [QUERY_KEY],
    queryFn: () => [],
    staleTime: Infinity,
    initialData: [],
  })
}
