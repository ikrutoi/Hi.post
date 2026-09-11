import { useLayoutEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { uploadUserImage, markLoading } from '../infrastructure/state'
import { useFileDialog, useImageUpload } from '../application/hooks'
import {
  registerCardphotoFilePicker,
  unregisterCardphotoFilePicker,
} from '../application/helpers/cardphotoFilePickerBridge'
import type { ImageMeta } from '../domain/types'
import styles from './CardphotoStage.module.scss'

/** Always-mounted hidden input so cardphotoAdd works before CardphotoStage paints. */
export function CardphotoFilePickerHost() {
  const dispatch = useAppDispatch()
  const setUserImage = (meta: ImageMeta) => dispatch(uploadUserImage(meta))
  const { inputRef, trackCancel } = useFileDialog()
  const handleFileChange = useImageUpload(setUserImage, () =>
    dispatch(markLoading()),
  )

  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input) return
    registerCardphotoFilePicker(input, trackCancel)
    return () => unregisterCardphotoFilePicker()
  }, [trackCancel])

  return (
    <input
      type="file"
      accept="image/*"
      ref={inputRef}
      className={styles.imageInput}
      onChange={handleFileChange}
      tabIndex={-1}
      aria-hidden
    />
  )
}
