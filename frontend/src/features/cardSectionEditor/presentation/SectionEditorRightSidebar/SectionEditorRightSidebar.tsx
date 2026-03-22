import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades'
import { useToolbarFacade } from '@toolbar/application/facades'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
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
import styles from './SectionEditorRightSidebar.module.scss'

/**
 * Правый сайдбар (ширина как у левого, 3.6rem): превью фаворитов для фото / текст / конверт.
 */
export const SectionEditorRightSidebar: React.FC = () => {
  const dispatch = useAppDispatch()
  const { activeSection } = useSectionMenuFacade()
  const { sizeCard } = useSizeFacade()
  const sender = useAppSelector(selectSenderState)
  const { items: previewStripItems, reload: reloadPreviewStrip } =
    usePreviewStripItems(activeSection)
  const { removeCropId: removeCardphotoCropId } = useCardphotoFacade()
  const { deleteCardtextTemplate } = useTemplateActions()
  const { selectSenderFromList, selectRecipientFromList, toggleSenderEnabled } =
    useEnvelopeFacade()

  const { state: toolbarCardphotoState } = useToolbarFacade('cardphoto')
  const { state: toolbarEditorMenuState } =
    useToolbarFacade('sectionEditorMenu')

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
        removeCardphotoCropId(item.imageId)
      } else if (item.kind === 'cardtext') {
        await deleteCardtextTemplate(item.templateId)
        dispatch(removeCardtextTemplateId(item.templateId))
        await reloadPreviewStrip()
      } else if (item.kind === 'address') {
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
      removeCardphotoCropId,
      sender.enabled,
      deleteCardtextTemplate,
      reloadPreviewStrip,
      toggleSenderEnabled,
    ],
  )

  const showPreviewStrip =
    activeSection === 'cardphoto' &&
    toolbarCardphotoState.crop?.state !== 'active'
  // Cardtext: right sidebar strip with favorite texts disabled for now
  // Envelope: no right strip (favorites live in list top zone); slot reserved for future use

  if (!sizeCard || !showPreviewStrip) {
    return <div className={styles.sectionEditorRightSidebar} />
  }

  return (
    <div className={styles.sectionEditorRightSidebar}>
      <div
        className={styles.previewStripContainer}
        style={{ height: `${sizeCard.height}px` }}
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
    </div>
  )
}
