import React from 'react'

import { ImageCrop } from './ImageCrop'

export const ImageCropPlayground = () => {
  return (
    <div style={{ padding: 40, background: '#f0f0f0' }}>
      <h2>🧪 ImageCrop Playground</h2>
      <ImageCrop sizeCard={{ width: 300, height: 200 }} />
    </div>
  )
}
