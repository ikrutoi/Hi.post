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
import { useEnvelopeFacade } from '@envelope/application/facades'
import { selectSenderState } from '@envelope/sender/infrastructure/selectors'
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
  const { deleteCardtextTemplate } = useTemplateActions()
  const { selectSenderFromList, selectRecipientFromList, toggleSenderEnabled } =
    useEnvelopeFacade()

  const handleSelectPreviewItem = useCallback(
    async (item: PreviewStripItem) => {
      if (item.kind !== 'address') return
      const template = await templateService.getAddressTemplateById(
        item.addressType,
        item.templateId,
      )
      if (!template?.address) return
      const entry = { id: String(template.id), address: template.address }
      if (template.type === 'sender') {
        selectSenderFromList(entry)
      } else {
        selectRecipientFromList(entry)
      }
    },
    [selectSenderFromList, selectRecipientFromList],
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
        // Только снять из избранного (полоса быстрого доступа), контакт в адресной книге не удаляем
        dispatch(
          removeAddressTemplateRef({
            type: item.addressType,
            id: item.templateId,
          }),
        )
        await reloadPreviewStrip()
        toggleSenderEnabled(sender.enabled)
      }
    },
    [
      dispatch,
      sender.enabled,
      cardphotoActions,
      deleteCardtextTemplate,
      reloadPreviewStrip,
      toggleSenderEnabled,
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
