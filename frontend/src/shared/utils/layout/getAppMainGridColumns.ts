import { roundTo } from '../../helpers'

const DEFAULT_TOTAL_COLUMNS = 12
const MIN_CONTENT_COLS = 1
const MIN_ASIDE_COLS = 1

/**
 * Считает число колонок грида appMain так, чтобы рабочий блок (пирог + тулбар + карточка)
 * оказался по центру appMain.
 * Отталкиваемся от ширины рабочего блока и ширины appMain.
 *
 * @param appMainWidth — ширина main (appMain) в px
 * @param contentBlockWidth — ширина блока контента (sizeMiniCard.height + 2*remSize + sizeCard.width) в px
 * @param totalColumns — общее число колонок грида (по умолчанию 12)
 * @returns { contentCols, asideCols } — колонки под контент и под aside
 */
export function getAppMainGridColumns(
  appMainWidth: number,
  contentBlockWidth: number,
  totalColumns: number = DEFAULT_TOTAL_COLUMNS,
): { contentCols: number; asideCols: number } {
  if (appMainWidth <= 0 || contentBlockWidth <= 0) {
    return {
      contentCols: Math.floor(totalColumns * 0.75),
      asideCols: totalColumns - Math.floor(totalColumns * 0.75),
    }
  }
  const contentRatio = 0.5 + contentBlockWidth / (2 * appMainWidth)
  let contentCols = roundTo.nearest(totalColumns * contentRatio)
  const maxContentCols = totalColumns - MIN_ASIDE_COLS
  contentCols = Math.max(MIN_CONTENT_COLS, Math.min(maxContentCols, contentCols))
  const asideCols = totalColumns - contentCols
  return { contentCols, asideCols }
}
