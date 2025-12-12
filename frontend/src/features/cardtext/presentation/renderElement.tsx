import React from 'react'
import type { RenderElementProps } from 'slate-react'
import type { CardtextBlock } from '../domain/types'

export const renderElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props
  const el = element as CardtextBlock

  switch (element.type) {
    case 'paragraph':
      return (
        <p {...attributes} style={{ textAlign: el.align || 'left' }}>
          {children}
        </p>
      )

    case 'heading':
      return (
        <h2 {...attributes} style={{ textAlign: el.align || 'left' }}>
          {children}
        </h2>
      )

    default:
      return (
        <div {...attributes} style={{ textAlign: el.align || 'left' }}>
          {children}
        </div>
      )
  }
}
