import { useState, useEffect } from 'react'
import { useCardphotoFacade } from '@cardphoto/application/facades'
import { storeAdapters } from '@db/adapters/storeAdapters'

// export const useActiveImageUrl = () => {
//   const { state: cardphotoState } = useCardphotoFacade()
//   // console.log('USE_MINI_CARDPHOTO state', cardphotoState)
//   const { appliedImage } = cardphotoState

//   const appliedId = appliedImage?.id
//   // const activeId = cardphotoState.activeImage?.id
//   const [url, setUrl] = useState<string | null>(null)

//   useEffect(() => {
//     if (!appliedId) return

//     let currentObjectUrl: string | null = null

//     const loadImage = async () => {
//       const cropRecord = await storeAdapters.cropImages.getById(appliedId)

//       if (cropRecord) {
//         if (cropRecord.thumbnail?.blob) {
//           currentObjectUrl = URL.createObjectURL(cropRecord.thumbnail.blob)
//           setUrl(currentObjectUrl)
//         } else if (cropRecord.full?.blob) {
//           currentObjectUrl = URL.createObjectURL(cropRecord.full.blob)
//           setUrl(currentObjectUrl)
//         } else {
//           setUrl(cropRecord.thumbnail?.url || cropRecord.url || null)
//         }
//       }
//     }

//     loadImage()

//     return () => {
//       if (currentObjectUrl) {
//         URL.revokeObjectURL(currentObjectUrl)
//       }
//     }
//   }, [appliedId])

//   return url
// }
