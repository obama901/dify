'use client'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback, useMemo } from 'react'

dayjs.extend(utc)
dayjs.extend(timezone)

const useTimestamp = () => {
  const userTimezone = useMemo(() => dayjs.tz.guess(), [])

  const formatTime = useCallback((value: number, format: string) => {
    return dayjs.unix(value).tz(userTimezone).format(format)
  }, [userTimezone])

  const formatDate = useCallback((value: string, format: string) => {
    return dayjs(value).tz(userTimezone).format(format)
  }, [userTimezone])

  return { formatTime, formatDate }
}

export default useTimestamp
