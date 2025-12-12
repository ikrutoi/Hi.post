import React from 'react'
import type { CardtextTextNode } from '../domain/types'

export const renderLeaf = ({
  attributes,
  children,
  leaf,
}: {
  attributes: any
  children: React.ReactNode
  leaf: CardtextTextNode
}) => {
  let style: React.CSSProperties = {}

  if (leaf.italic) style.fontStyle = 'italic'
  if (leaf.bold) style.fontWeight = 'bold'
  if (leaf.underline) style.textDecoration = 'underline'
  if (leaf.color) style.color = leaf.color
  if (leaf.fontSize) style.fontSize = `${leaf.fontSize}px`

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  )
}
