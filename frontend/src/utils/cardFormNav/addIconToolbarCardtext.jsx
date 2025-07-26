import {
  RiBold,
  RiItalic,
  RiFontSize2,
  RiFontColor,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
} from 'react-icons/ri'

export const addIconToolbarCardtext = (name) => {
  switch (name) {
    case 'bold':
      return <RiBold className="toolbar-icon" />
    case 'italic':
      return <RiItalic className="toolbar-icon" />
    case 'font-size':
      return <RiFontSize2 className="toolbar-icon toolbar-icon-font-size" />
    case 'color':
      return <RiFontColor className="toolbar-icon toolbar-icon-a" />
    case 'left':
      return <RiAlignLeft className="toolbar-icon" />
    case 'center':
      return <RiAlignCenter className="toolbar-icon" />
    case 'right':
      return <RiAlignRight className="toolbar-icon" />
    case 'justify':
      return <RiAlignJustify className="toolbar-icon" />

    default:
      break
  }
}
