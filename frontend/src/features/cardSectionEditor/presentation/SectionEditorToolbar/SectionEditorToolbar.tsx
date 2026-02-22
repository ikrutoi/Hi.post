import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import {
  PreviewStrip,
  usePreviewStripItems,
  type PreviewStripItem,
} from '@features/previewStrip'
import {
  removeCardtextTemplateId,
  removeAddressTemplateRef,
} from '@features/previewStrip/infrastructure/state'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { useTemplateActions } from '@entities/templates/application/hooks'
import { templateService } from '@entities/templates/domain/services/templateService'
import {
  setEnabled,
  updateSenderField,
} from '@envelope/sender/infrastructure/state'
import { updateRecipientField } from '@envelope/recipient/infrastructure/state'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
import { ADDRESS_FIELD_ORDER } from '@shared/config/constants'
import styles from './SectionEditorToolbar.module.scss'
import { CropQualityIndicator } from '@cardSectionToolbar/presentation/CropQualityIndicator'
// import { CropPreview } from '@/features/toolbar/presentation/CropPreview'

export const SectionEditorToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const { activeSection } = useSectionMenuFacade()
  const { sizeCard, remSize, sectionMenuHeight } = useSizeFacade()
  const sender = useAppSelector(selectSenderState)
  const { items: previewStripItems, reload: reloadPreviewStrip } =
    usePreviewStripItems(activeSection)
  const { actions: cardphotoActions } = useCardphotoFacade()
  const { deleteCardtextTemplate, deleteAddressTemplate } = useTemplateActions()

  const handleSelectPreviewItem = useCallback(
    async (item: PreviewStripItem) => {
      if (item.kind !== 'address') return
      const template = await templateService.getAddressTemplateById(
        item.addressType,
        item.templateId,
      )
      if (!template?.address) return
      const { address, type } = template
      for (const field of ADDRESS_FIELD_ORDER) {
        const value = address[field] ?? ''
        dispatch(
          type === 'sender'
            ? updateSenderField({ field, value })
            : updateRecipientField({ field, value }),
        )
      }
    },
    [dispatch],
  )

  const handleDeletePreviewItem = useCallback(
    async (item: PreviewStripItem) => {
      if (item.kind === 'cardphoto') {
        cardphotoActions.removeCropId(item.imageId)
      } else if (item.kind === 'cardtext') {
        await deleteCardtextTemplate(item.templateId)
        dispatch(removeCardtextTemplateId(item.templateId))
        await reloadPreviewStrip()
      } else if (item.kind === 'address') {
        await deleteAddressTemplate(item.addressType, item.templateId)
        dispatch(
          removeAddressTemplateRef({
            type: item.addressType,
            id: item.templateId,
          }),
        )
        await reloadPreviewStrip()
        dispatch(setEnabled(sender.enabled))
      }
    },
    [
      dispatch,
      sender.enabled,
      cardphotoActions,
      deleteCardtextTemplate,
      deleteAddressTemplate,
      reloadPreviewStrip,
    ],
  )

  const { state: toolbarCardphotoState } = useToolbarFacade('cardphoto')
  const { state: toolbarEditorMenuState } =
    useToolbarFacade('sectionEditorMenu')

  if (!sizeCard || !remSize) return null

  const showQualityIndicator =
    sectionMenuHeight &&
    toolbarCardphotoState.crop.state === 'active' &&
    toolbarEditorMenuState.cardphoto === 'active'

  const showPreviewStrip =
    (activeSection === 'cardphoto' &&
      toolbarCardphotoState.crop.state !== 'active') ||
    activeSection === 'cardtext' ||
    activeSection === 'envelope'

  return (
    <div className={styles.sectionEditorToolbar}>
      <Toolbar section="sectionEditorMenu" />

      {(activeSection === 'cardphoto' || activeSection === 'cardtext') && (
        <Toolbar section={activeSection} />
      )}

      <div className={styles.sectionEditorToolbarTop}></div>

      {showQualityIndicator && (
        <div
          className={clsx(
            styles.sectionEditorToolbarRight,
            styles.sectionEditorToolbarRightCropQuality,
          )}
          style={{ height: `${sizeCard.height}px` }}
        >
          <CropQualityIndicator />
        </div>
      )}

      {showPreviewStrip && (
        <div
          className={clsx(
            styles.sectionEditorToolbarRight,
            styles.sectionEditorToolbarRightCropPreview,
          )}
          style={{
            height: `${sizeCard.height}px`,
          }}
        >
          <PreviewStrip
            items={previewStripItems}
            containerHeight={sizeCard.height}
            onDelete={handleDeletePreviewItem}
            onSelectItem={
              activeSection === 'envelope' ? handleSelectPreviewItem : undefined
            }
          />
        </div>
      )}

      {/* {activeSection === 'cardphoto' &&
        toolbarCardphotoState.crop.state !== 'active' && (
          <div
            className={clsx(
              styles.sectionEditorToolbarRight,
              styles.sectionEditorToolbarRightCropPreview,
            )}
            style={{
              height: `${sizeCard.height}px`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CropPreview variant="panel" />
          </div>
        )} */}
    </div>
  )
}
