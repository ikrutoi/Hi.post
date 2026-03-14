import { useState, useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCardtextTemplatesListItems,
  selectCardtextTemplatesListLoading,
} from '@cardtext/infrastructure/selectors'
import { loadCardtextTemplatesRequest } from '@cardtext/infrastructure/state'
import { templateService } from '../../domain/services/templateService'
import type { AddressTemplate } from '../../domain/types/addressTemplate.types'
import type { CardtextTemplate } from '@cardtext/domain/types'
import type { CardphotoTemplate } from '../../domain/types/cardphotoTemplate.types'
import type { AddressType, ImageSourceType } from '../../domain/types'

export const useTemplates = () => {
  const [recipientTemplates, setRecipientTemplates] = useState<
    AddressTemplate[]
  >([])
  const [senderTemplates, setSenderTemplates] = useState<AddressTemplate[]>([])
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false)
  const [isLoadingSenders, setIsLoadingSenders] = useState(false)

  const [userImageTemplates, setUserImageTemplates] = useState<
    CardphotoTemplate[]
  >([])
  const [stockImageTemplates, setStockImageTemplates] = useState<
    CardphotoTemplate[]
  >([])
  const [isLoadingUserImages, setIsLoadingUserImages] = useState(false)
  const [isLoadingStockImages, setIsLoadingStockImages] = useState(false)

  const loadRecipientTemplates = useCallback(async () => {
    setIsLoadingRecipients(true)
    try {
      const templates = await templateService.getAddressTemplates('recipient')
      setRecipientTemplates(templates)
    } catch (error) {
      console.error('Failed to load recipient templates:', error)
    } finally {
      setIsLoadingRecipients(false)
    }
  }, [])

  const loadSenderTemplates = useCallback(async () => {
    setIsLoadingSenders(true)
    try {
      const templates = await templateService.getAddressTemplates('sender')
      setSenderTemplates(templates)
    } catch (error) {
      console.error('Failed to load sender templates:', error)
    } finally {
      setIsLoadingSenders(false)
    }
  }, [])

  const loadAddressTemplates = useCallback(async () => {
    await Promise.all([loadRecipientTemplates(), loadSenderTemplates()])
  }, [loadRecipientTemplates, loadSenderTemplates])

  const loadUserImageTemplates = useCallback(async () => {
    setIsLoadingUserImages(true)
    try {
      const templates = await templateService.getCardphotoTemplates('user')
      setUserImageTemplates(templates)
    } catch (error) {
      console.error('Failed to load user image templates:', error)
    } finally {
      setIsLoadingUserImages(false)
    }
  }, [])

  const loadStockImageTemplates = useCallback(async () => {
    setIsLoadingStockImages(true)
    try {
      const templates = await templateService.getCardphotoTemplates('stock')
      setStockImageTemplates(templates)
    } catch (error) {
      console.error('Failed to load stock image templates:', error)
    } finally {
      setIsLoadingStockImages(false)
    }
  }, [])

  const loadImageTemplates = useCallback(async () => {
    await Promise.all([loadUserImageTemplates(), loadStockImageTemplates()])
  }, [loadUserImageTemplates, loadStockImageTemplates])

  const loadAllTemplates = useCallback(async () => {
    await Promise.all([loadAddressTemplates(), loadImageTemplates()])
  }, [loadAddressTemplates, loadImageTemplates])

  return {
    recipientTemplates,
    senderTemplates,
    isLoadingRecipients,
    isLoadingSenders,
    loadRecipientTemplates,
    loadSenderTemplates,
    loadAddressTemplates,

    userImageTemplates,
    stockImageTemplates,
    isLoadingUserImages,
    isLoadingStockImages,
    loadUserImageTemplates,
    loadStockImageTemplates,
    loadImageTemplates,

    loadAllTemplates,
  }
}

export const useAddressTemplates = (type: AddressType) => {
  const {
    recipientTemplates,
    senderTemplates,
    isLoadingRecipients,
    isLoadingSenders,
    loadRecipientTemplates,
    loadSenderTemplates,
  } = useTemplates()

  const templates = type === 'recipient' ? recipientTemplates : senderTemplates
  const isLoading =
    type === 'recipient' ? isLoadingRecipients : isLoadingSenders
  const loadTemplates =
    type === 'recipient' ? loadRecipientTemplates : loadSenderTemplates

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  return {
    templates,
    isLoading,
    reload: loadTemplates,
  }
}

export const useCardtextTemplates = () => {
  const dispatch = useAppDispatch()
  const templates = useAppSelector(selectCardtextTemplatesListItems)
  const isLoading = useAppSelector(selectCardtextTemplatesListLoading)

  return {
    templates,
    isLoading,
    reload: useCallback(() => {
      dispatch(loadCardtextTemplatesRequest())
    }, [dispatch]),
  }
}

export const useCardphotoTemplates = (source: ImageSourceType) => {
  const {
    userImageTemplates,
    stockImageTemplates,
    isLoadingUserImages,
    isLoadingStockImages,
    loadUserImageTemplates,
    loadStockImageTemplates,
  } = useTemplates()

  const templates = source === 'user' ? userImageTemplates : stockImageTemplates
  const isLoading =
    source === 'user' ? isLoadingUserImages : isLoadingStockImages
  const loadTemplates =
    source === 'user' ? loadUserImageTemplates : loadStockImageTemplates

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  return {
    templates,
    isLoading,
    reload: loadTemplates,
  }
}
