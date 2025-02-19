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
      return (
        <RiItalic
          // ref={iconItalicRef}
          className="toolbar-icon"
          // style={{ color: handleChoiceActive('italic') }}
        />
      )
    case 'font-size':
      return (
        // <span className="toolbar-font-size-full">
        <RiFontSize2 className="toolbar-icon toolbar-icon-font-size" />
        // <FaAngleDown className="toolbar-icon" />
        // </span>
      )
    case 'color':
      return (
        // <span className="toolbar-font-size-full">
        // <span className="cardformnav-toolbar-icon toolbar-icon-color">
        <RiFontColor className="toolbar-icon toolbar-icon-a" />
        // <span
        // className="toolbar-icon-dash"
        // style={{ backgroundColor: toolbarIconColor }}
        // ></span>
        // </span>
        // <FaAngleDown className="cardformnav-toolbar-icon" />
        // </span>
      )
    // case 'strikethrough':
    // return <FaStrikethrough className="cardformnav-toolbar-icon" />
    case 'left':
      return (
        <RiAlignLeft
          className="toolbar-icon"
          // style={{ color: handleChoiceActive('left') }}
        />
      )
    case 'center':
      return (
        <RiAlignCenter
          className="toolbar-icon"
          // style={{ color: handleChoiceActive('center') }}
        />
      )
    case 'right':
      return (
        <RiAlignRight
          className="toolbar-icon"
          // style={{ color: handleChoiceActive('right') }}
        />
      )
    case 'justify':
      return (
        <RiAlignJustify
          className="toolbar-icon"
          // style={{ color: handleChoiceActive('justify') }}
        />
      )

    default:
      break
  }
}
