import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import type {
  DateState,
  DispatchDate,
  FirstDayOfWeekPreference,
} from '@entities/date/domain/types'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'
import {
  readStoredFirstDayOfWeek,
  writeStoredFirstDayOfWeek,
} from '../firstDayOfWeek.storage'

const initialState: DateState = {
  selectedDate: null,
  selectedDates: [],
  appliedDates: [],
  isMultiDateMode: true,
  multiGroupId: nanoid(),
  // isHistoryMode: false,
  isComplete: false,
  firstDayOfWeek: readStoredFirstDayOfWeek(),
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

function cloneDates(dates: DispatchDate[]): DispatchDate[] {
  return dates.map((d) => ({ ...d }))
}

/** Commit draft → applied (Apply / hydrate complete / archive copy). */
function commitAppliedFromDraft(state: DateState, dates: DispatchDate[]) {
  state.appliedDates = cloneDates(dates)
  state.isComplete = dates.length > 0
}

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
    /** Полная подстановка даты (donor / session commit) — draft + applied. */
    setDate(state, action: PayloadAction<DispatchDate>) {
      const d = action.payload
      state.selectedDate = d
      state.selectedDates = [{ ...d }]
      commitAppliedFromDraft(state, state.selectedDates)
      state.excludedDispatchBranches = []
      state.cachedMultiDates = state.selectedDates.map((x) => ({ ...x }))
    },

    /**
     * Клик по дню в календаре: только черновик.
     * CardPie / plan очищаются до следующего `applyDispatchDates`.
     */
    pickDispatchDate(state, action: PayloadAction<DispatchDate>) {
      const d = action.payload
      const idx = state.selectedDates.findIndex((x) => sameDispatchDate(x, d))
      if (idx >= 0) {
        state.selectedDates.splice(idx, 1)
        if (state.selectedDates.length === 0) {
          state.selectedDate = null
          state.cachedSingleDate = null
        } else {
          state.selectedDate =
            state.selectedDates[state.selectedDates.length - 1]
        }
      } else {
        state.selectedDates.push(d)
        state.selectedDate = d
      }
      state.cachedMultiDates = state.selectedDates.map((x) => ({ ...x }))
      /** Пока нет Apply — секция даты CardPie пустая. */
      state.appliedDates = []
      state.isComplete = false
      pruneExcludedDispatchBranches(state, state.selectedDates)
    },

    /** Подстановка списка дат (archive / backup) — draft + applied. */
    setSelectedDates(state, action: PayloadAction<DispatchDate[]>) {
      const prevLen = state.selectedDates.length
      state.selectedDates = action.payload
      if (action.payload.length > 0) {
        state.selectedDate = {
          ...action.payload[action.payload.length - 1],
        }
      } else {
        state.selectedDate = null
      }
      commitAppliedFromDraft(state, state.selectedDates)
      state.cachedMultiDates = state.selectedDates.map((x) => ({ ...x }))
      if (action.payload.length === 0 && prevLen > 0) {
        state.cachedSingleDate = null
      }
      pruneExcludedDispatchBranches(state, action.payload)
    },

    /** Apply: зафиксировать черновик календаря в секцию даты CardPie. */
    applyDispatchDates(state) {
      commitAppliedFromDraft(state, state.selectedDates)
      pruneExcludedDispatchBranches(state, state.appliedDates)
    },

    /** Снять applied (postcardEdit), черновик календаря оставить. */
    clearAppliedDates(state) {
      state.appliedDates = []
      state.isComplete = false
    },

    clearDate(state) {
      state.selectedDate = null
      state.selectedDates = []
      state.appliedDates = []
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
      state.isMultiDateMode = true
      state.multiGroupId = nanoid()
    },

    excludeDispatchBranch(state, action: PayloadAction<{ branchKey: string }>) {
      const { branchKey } = action.payload
      if (!state.excludedDispatchBranches.includes(branchKey)) {
        state.excludedDispatchBranches.push(branchKey)
      }
    },

    /**
     * Card pie: сброс черновика из списка (иконка удалить на единственной строке без ветки).
     * Ветки `excludedDispatchBranches` чистим здесь; секции редактора — в саге `editorPieProcessSaga`.
     */
    clearCardPieEditorSession(state) {
      state.excludedDispatchBranches = []
    },

    /** Saga-only: добавление в корзину по ветке плана (Card pie); без удаления существующих строк. */
    toggleCartForDispatchBranch(
      _state,
      _action: PayloadAction<{
        branchKey: string
        /** В списке CardPie была одна строка — после addCart сбросить мини-секции. */
        clearEditorAfterAdd?: boolean
      }>,
    ) {},

    /** Saga-only: addCart из editorPie — одна или несколько веток плана, либо bulk из редактора. */
    addEditorPiePlanToCart(
      _state,
      _action: PayloadAction<{
        branchKeys?: string[]
        /** В плане была одна строка — после addCart сбросить мини-секции (как в CardPiePanel). */
        clearEditorAfterAdd?: boolean
      }>,
    ) {},

    setFirstDayOfWeek(state, action: PayloadAction<FirstDayOfWeekPreference>) {
      state.firstDayOfWeek = action.payload
      writeStoredFirstDayOfWeek(action.payload)
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
      const rawApplied = Array.isArray(s.appliedDates) ? s.appliedDates : []
      const appliedFiltered = rawApplied.filter((d) => !orderDisabled(d))
      const sessionComplete = Boolean(s.isComplete)
      if (sessionComplete) {
        state.appliedDates =
          appliedFiltered.length > 0
            ? appliedFiltered
            : cloneDates(state.selectedDates)
      } else {
        state.appliedDates = []
      }
      state.isComplete = state.appliedDates.length > 0
      const nextFirstDay =
        s.firstDayOfWeek === 'Mon' || s.firstDayOfWeek === 'Sun'
          ? s.firstDayOfWeek
          : state.firstDayOfWeek
      state.firstDayOfWeek = nextFirstDay
      writeStoredFirstDayOfWeek(nextFirstDay)
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
  applyDispatchDates,
  clearAppliedDates,
  clearDate,
  setMultiDateMode,
  setFirstDayOfWeek,
  hydrateDateFromSession,
  excludeDispatchBranch,
  clearCardPieEditorSession,
  toggleCartForDispatchBranch,
  addEditorPiePlanToCart,
  // setHistoryListPanelOpen,
  // setDateListPanelOpen,
  // setHistoryMode,
} = dateSlice.actions
export default dateSlice.reducer
