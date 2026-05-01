import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import type {
  DateState,
  DispatchDate,
  FirstDayOfWeekPreference,
} from '@entities/date/domain/types'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'

const initialState: DateState = {
  selectedDate: null,
  selectedDates: [],
  isMultiDateMode: true,
  multiGroupId: nanoid(),
  // isHistoryMode: false,
  isComplete: false,
  firstDayOfWeek: 'Sun',
  cachedSingleDate: null,
  cachedMultiDates: [],
  excludedDispatchBranches: [],
  // historyListPanelOpen: false,
  // dateListPanelOpen: false,
}

const sameDispatchDate = (a: DispatchDate, b: DispatchDate) =>
  a.year === b.year && a.month === b.month && a.day === b.day

const dispatchDateKey = (d: DispatchDate) =>
  `${d.year}-${d.month}-${d.day}`

/** Оставить только ветки, чья дата всё ещё в списке выбранных дней отправки. */
function pruneExcludedDispatchBranches(state: DateState, dates: DispatchDate[]) {
  const allowed = new Set(dates.map(dispatchDateKey))
  state.excludedDispatchBranches = state.excludedDispatchBranches.filter((k) => {
    const datePart = k.split('|')[0] ?? ''
    return allowed.has(datePart)
  })
}

export const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<DispatchDate>) {
      const d = action.payload
      state.selectedDate = d
      state.selectedDates = [{ ...d }]
      state.isComplete = true
      state.excludedDispatchBranches = []
      state.cachedMultiDates = state.selectedDates.map((x) => ({ ...x }))
    },

    pickDispatchDate(state, action: PayloadAction<DispatchDate>) {
      const d = action.payload
      const idx = state.selectedDates.findIndex((x) => sameDispatchDate(x, d))
      if (idx >= 0) {
        state.selectedDates.splice(idx, 1)
        if (state.selectedDates.length === 0) {
          state.selectedDate = null
          state.isComplete = false
          state.cachedSingleDate = null
        } else {
          state.selectedDate =
            state.selectedDates[state.selectedDates.length - 1]
          state.isComplete = true
        }
      } else {
        state.selectedDates.push(d)
        state.selectedDate = d
        state.isComplete = true
      }
      state.cachedMultiDates = state.selectedDates.map((x) => ({ ...x }))
      pruneExcludedDispatchBranches(state, state.selectedDates)
    },

    setSelectedDates(state, action: PayloadAction<DispatchDate[]>) {
      const prevLen = state.selectedDates.length
      state.selectedDates = action.payload
      if (action.payload.length > 0) {
        state.selectedDate = {
          ...action.payload[action.payload.length - 1],
        }
        state.isComplete = true
      } else {
        state.selectedDate = null
        state.isComplete = false
      }
      state.cachedMultiDates = state.selectedDates.map((x) => ({ ...x }))
      if (action.payload.length === 0 && prevLen > 0) {
        state.cachedSingleDate = null
      }
      pruneExcludedDispatchBranches(state, action.payload)
    },

    clearDate(state) {
      state.selectedDate = null
      state.selectedDates = []
      state.isMultiDateMode = true
      state.multiGroupId = nanoid()
      state.isComplete = false
      state.cachedSingleDate = null
      state.cachedMultiDates = []
      state.excludedDispatchBranches = []
    },

    setMultiDateMode(state, action: PayloadAction<boolean>) {
      if (!action.payload) {
        return
      }
      state.excludedDispatchBranches = []
      state.cachedSingleDate = state.selectedDate
      state.selectedDates =
        state.selectedDate == null
          ? []
          : state.cachedMultiDates.map((d) => ({ ...d }))
      state.selectedDate =
        state.selectedDates.length > 0
          ? { ...state.selectedDates[state.selectedDates.length - 1] }
          : null
      state.isComplete = state.selectedDates.length > 0
      state.isMultiDateMode = true
      state.multiGroupId = nanoid()
    },

    excludeDispatchBranch(state, action: PayloadAction<{ branchKey: string }>) {
      const { branchKey } = action.payload
      if (!state.excludedDispatchBranches.includes(branchKey)) {
        state.excludedDispatchBranches.push(branchKey)
      }
    },

    /** Saga-only: переключение корзины по ветке плана (Card pie / список дат). */
    toggleCartForDispatchBranch(
      _state,
      _action: PayloadAction<{ branchKey: string }>,
    ) {},

    setFirstDayOfWeek(state, action: PayloadAction<FirstDayOfWeekPreference>) {
      state.firstDayOfWeek = action.payload
    },

    hydrateDateFromSession(state, action: PayloadAction<DateState>) {
      const s = action.payload
      const now = getCurrentDate()
      const orderDisabled = (d: DispatchDate | null | undefined) =>
        d != null && isDispatchDateDisabledForOrder(d, now)

      const rawSelectedDates = Array.isArray(s.selectedDates)
        ? s.selectedDates
        : []
      const selectedDatesFiltered = rawSelectedDates.filter((d) => !orderDisabled(d))

      let selectedDateNext = s.selectedDate ?? null
      if (orderDisabled(selectedDateNext)) {
        selectedDateNext = null
      }
      if (selectedDateNext == null && selectedDatesFiltered.length > 0) {
        selectedDateNext = {
          ...selectedDatesFiltered[selectedDatesFiltered.length - 1],
        }
      }

      state.selectedDate = selectedDateNext
      state.selectedDates =
        selectedDatesFiltered.length > 0
          ? selectedDatesFiltered
          : selectedDateNext != null
            ? [{ ...selectedDateNext }]
            : []

      state.isMultiDateMode = s.isMultiDateMode ?? false
      const hasDispatchSelection =
        state.selectedDates.length > 0 || state.selectedDate != null
      state.isComplete = hasDispatchSelection && Boolean(s.isComplete)
      state.firstDayOfWeek = s.firstDayOfWeek ?? 'Sun'
      state.cachedSingleDate =
        s.cachedSingleDate != null && !orderDisabled(s.cachedSingleDate)
          ? s.cachedSingleDate
          : null
      const fromCache = Array.isArray(s.cachedMultiDates)
        ? s.cachedMultiDates
        : []
      const baseCachedMulti =
        fromCache.length > 0
          ? fromCache
          : (s.isMultiDateMode ?? false) && rawSelectedDates.length > 0
            ? rawSelectedDates.map((d) => ({ ...d }))
            : []
      state.cachedMultiDates = baseCachedMulti.filter((d) => !orderDisabled(d))
      state.multiGroupId =
        s.multiGroupId != null
          ? s.multiGroupId
          : (s.isMultiDateMode ?? false)
            ? nanoid()
            : null
      const hydratedMulti = s.isMultiDateMode ?? false
      const datesForPrune: DispatchDate[] = hydratedMulti
        ? state.selectedDates
        : state.selectedDate
          ? [state.selectedDate]
          : []
      const allowed = new Set(datesForPrune.map(dispatchDateKey))
      const rawExcluded = Array.isArray(s.excludedDispatchBranches)
        ? s.excludedDispatchBranches
        : []
      state.excludedDispatchBranches = rawExcluded.filter((k) => {
        const datePart = k.split('|')[0] ?? ''
        return allowed.has(datePart)
      })

      state.isMultiDateMode = true
      if (state.selectedDates.length === 0 && state.selectedDate != null) {
        state.selectedDates = [{ ...state.selectedDate }]
      }
      if (state.selectedDate == null && state.selectedDates.length > 0) {
        state.selectedDate = {
          ...state.selectedDates[state.selectedDates.length - 1],
        }
      }
      if (state.multiGroupId == null) {
        state.multiGroupId = nanoid()
      }
      const allowedMulti = new Set(state.selectedDates.map(dispatchDateKey))
      state.excludedDispatchBranches = state.excludedDispatchBranches.filter(
        (k) => {
          const datePart = k.split('|')[0] ?? ''
          return allowedMulti.has(datePart)
        },
      )
    },

    // setHistoryListPanelOpen(state, action: PayloadAction<boolean>) {
    //   state.historyListPanelOpen = action.payload
    // },

    // setDateListPanelOpen(state, action: PayloadAction<boolean>) {
    //   state.dateListPanelOpen = action.payload
    // },

    // setHistoryMode(state, action: PayloadAction<boolean>) {
    //   state.isHistoryMode = action.payload
    // },
  },
})

export const {
  setDate,
  pickDispatchDate,
  setSelectedDates,
  clearDate,
  setMultiDateMode,
  setFirstDayOfWeek,
  hydrateDateFromSession,
  excludeDispatchBranch,
  toggleCartForDispatchBranch,
  // setHistoryListPanelOpen,
  // setDateListPanelOpen,
  // setHistoryMode,
} = dateSlice.actions
export default dateSlice.reducer
