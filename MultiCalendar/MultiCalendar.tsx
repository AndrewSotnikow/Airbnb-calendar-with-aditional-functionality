import React, {
  ReactElement,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import moment, { Moment } from 'moment'
import { DayPickerSingleDateController, CalendarDay } from 'react-dates'
import './MultiCalendar.scss'
import 'moment/locale/pl'
import { isTabletRes } from './utils/helpers'

export interface IMultiCalendarProps {
  mode?: 'range' | 'single'
  limit?: number
  weekends: boolean
  onChange: (days: string[]) => void
  isReset?: boolean
  onResetCalendar: Dispatch<SetStateAction<boolean>>
}

const MultiCalendar = ({
  mode = 'single',
  limit = 0,
  weekends = false,
  onChange,
  onResetCalendar,
}: IMultiCalendarProps): ReactElement => {
  const [dates, setDates] = useState<Moment[]>([])

  useEffect(() => {
    moment.locale('pl')
  }, [])

  useEffect(() => {
    onChange(formatDatesString(dates))
    onResetCalendar(false)
  }, [dates])

  const blockedWeekend = (day: Moment | null) => {
    if (weekends || !day) return false
    return day.isoWeekday() >= 6
  }

  const formatDatesString = (array: Moment[]) => {
    return array.map((date) => moment(date).format('YYYY-MM-DD'))
  }

  const monthAmount = isTabletRes() ? 1 : 2

  const getDaysBetweenDates = (startDate: Moment, endDate: Moment) => {
    const now = startDate.clone()
    const end = endDate.clone()
    const dates = []

    return dates
  }

  const handleDateChange = (date: Moment | null) => {
    if (date === null) return

    const wasPreviouslyPicked = dates.some((d) => d.isSame(date))

    if (wasPreviouslyPicked) {
      if (mode === 'single') {
        setDates((previousDates) =>
          previousDates.filter((d) => !d.isSame(date))
        )
      } else {
        setDates(getDaysBetweenDates(date, moment(date).add(limit - 1, 'days')))
      }
    } else {
      if (mode === 'single') {
        if (limit === 0) {
          setDates([...dates, date])
        } else if (limit === 1) {
          setDates([date])
        }
      } else {
        setDates(getDaysBetweenDates(date, moment(date).add(limit - 1, 'days')))
      }
    }
  }

  return (
    <div
      className='c-calendar -pt28 -pt0md d-flex flex-column -scrollMargin'
      data-testid='Calendar'
      id='calendar'
    >
      <DayPickerSingleDateController
        onDateChange={handleDateChange}
        focused={true}
        onFocusChange={() => null}
        date={null}
        keepOpenOnDateSelect
        numberOfMonths={monthAmount}
        renderCalendarDay={(props) => {
          // eslint-disable-next-line react/prop-types
          const { day, modifiers } = props

          if (day && dates.some((d) => d.isSame(day, 'day'))) {
            // eslint-disable-next-line react/prop-types
            modifiers && modifiers.add('selected')
          } else {
            // eslint-disable-next-line react/prop-types
            modifiers && modifiers.delete('selected')
          }

          return <CalendarDay {...props} modifiers={new Set(modifiers)} />
        }}
        isDayBlocked={(day) => blockedWeekend(day) || false}
      />
    </div>
  )
}

export default MultiCalendar
