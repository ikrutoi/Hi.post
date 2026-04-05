import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import type {
  DateState,
  DispatchDate,
  FirstDayOfWeekPreference,
} from '@entities/date/domain/types'

const initialState: DateState = {
  selectedDate: null,
  selectedDates: [],
  isMultiDateMode: false,
  multiGroupId: null,
  isComplete: false,
  firstDayOfWeek: 'Sun',
  cachedSingleDate: null,
  cachedMultiDates: [],
}

const sameDispatchDate = (a: DispatchDate, b: DispatchDate) =>
  a.year === b.year && a.month === b.month && a.day === b.day

export const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<DispatchDate>) {
      state.selectedDate = action.payload
      state.selectedDates = []
      state.isComplete = true
    },
    pickDispatchDate(state, action: PayloadAction<DispatchDate>) {
      const d = action.payload
      if (!state.isMultiDateMode) {
        if (state.selectedDate && sameDispatchDate(state.selectedDate, d)) {
          state.selectedDate = null
          state.selectedDates = []
          state.isComplete = false
        } else {
          state.selectedDate = d
          state.selectedDates = []
          state.isComplete = true
        }
        return
      }
      const idx = state.selectedDates.findIndex((x) => sameDispatchDate(x, d))
      if (idx >= 0) {
        state.selectedDates.splice(idx, 1)
        if (state.selectedDates.length === 0) {
          state.selectedDate = null
          state.isComplete = false
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
    },
    setSelectedDates(state, action: PayloadAction<DispatchDate[]>) {
      state.selectedDates = action.payload
      state.isComplete =
        action.payload.length > 0 || state.selectedDate != null
      if (state.isMultiDateMode) {
        state.cachedMultiDates = state.selectedDates.map((x) => ({ ...x }))
      }
    },
    clearDate(state) {
      state.selectedDate = null
      state.selectedDates = []
      state.isMultiDateMode = false
      state.multiGroupId = null
      state.isComplete = false
      state.cachedSingleDate = null
      state.cachedMultiDates = []
    },
    setMultiDateMode(state, action: PayloadAction<boolean>) {
      const enabled = action.payload
      if (enabled) {
        state.cachedSingleDate = state.selectedDate
        state.selectedDates = state.cachedMultiDates.map((d) => ({ ...d }))
        state.selectedDate =
          state.selectedDates.length > 0
            ? { ...state.selectedDates[state.selectedDates.length - 1] }
            : null
        state.isComplete = state.selectedDates.length > 0
        state.isMultiDateMode = true
        state.multiGroupId = nanoid()
        return
      }
      state.cachedMultiDates = state.selectedDates.map((d) => ({ ...d }))
      state.selectedDates = []
      state.selectedDate = state.cachedSingleDate
      state.multiGroupId = null
      if (state.selectedDate == null && state.cachedMultiDates.length > 0) {
        state.selectedDate = { ...state.cachedMultiDates[0] }
      }
      state.isComplete = state.selectedDate != null
      state.isMultiDateMode = false
    },
    setFirstDayOfWeek(state, action: PayloadAction<FirstDayOfWeekPreference>) {
      state.firstDayOfWeek = action.payload
    },
    hydrateDateFromSession(state, action: PayloadAction<DateState>) {
      const s = action.payload
      state.selectedDate = s.selectedDate ?? null
      state.selectedDates = Array.isArray(s.selectedDates) ? s.selectedDates : []
      state.isMultiDateMode = s.isMultiDateMode ?? false
      state.isComplete = s.isComplete ?? false
      state.firstDayOfWeek = s.firstDayOfWeek ?? 'Sun'
      state.cachedSingleDate = s.cachedSingleDate ?? null
      const fromCache = Array.isArray(s.cachedMultiDates) ? s.cachedMultiDates : []
      state.cachedMultiDates =
        fromCache.length > 0
          ? fromCache
          : (s.isMultiDateMode ?? false) &&
              Array.isArray(s.selectedDates) &&
              s.selectedDates.length > 0
            ? s.selectedDates.map((d) => ({ ...d }))
            : []
      state.multiGroupId =
        s.multiGroupId != null
          ? s.multiGroupId
          : (s.isMultiDateMode ?? false)
            ? nanoid()
            : null
    },
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
} = dateSlice.actions
export default dateSlice.reducer
