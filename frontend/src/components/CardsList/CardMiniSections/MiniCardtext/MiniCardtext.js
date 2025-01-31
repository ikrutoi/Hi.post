import { useSelector } from 'react-redux'
import { useEffect, useMemo, useRef, useState } from 'react'
import './MiniCardtext.scss'
import { Editable, Slate, withReact } from 'slate-react'
import { createEditor } from 'slate'

const MiniCardtext = ({ cardminiRef: miniCardtextRef }) => {
  const selector = useSelector((state) => state.cardEdit.cardtext)
  const inputCardtext = selector && selector.text ? selector : null
  const miniEditor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(
    inputCardtext
      ? inputCardtext.text
      : [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ]
  )

  const [maxLines, setMaxLines] = useState(selector.miniCardtextStyle.maxLine)
  const [lineHeight, setLineHeight] = useState(
    selector.miniCardtextStyle.lineHeight
  )
  const [fontSize, setFontSize] = useState(selector.miniCardtextStyle.fontStyle)

  useEffect(() => {
    if (selector && JSON.stringify(selector.text) !== JSON.stringify(value)) {
      miniEditor.children = selector.text
      setValue(selector.text)
      setMaxLines(selector.maxLines)
    }
  }, [selector, miniEditor, value])

  useEffect(() => {
    if (miniCardtextRef) {
      const totalHeightCardmini = miniCardtextRef.clientHeight
      const computedStyle = window.getComputedStyle(miniCardtextRef)
      const paddingTop = parseFloat(computedStyle.paddingTop)
      const paddingBottom = parseFloat(computedStyle.paddingBottom)
      const heightCardMini = totalHeightCardmini - paddingTop - paddingBottom

      setLineHeight(heightCardMini / maxLines)
      setFontSize(heightCardMini / maxLines / 1.33)
    }
  }, [maxLines, miniCardtextRef])

  return (
    <div className="mini-editor">
      <Slate editor={miniEditor} initialValue={inputCardtext.text}>
        <Editable
          readOnly={true}
          style={
            inputCardtext && {
              fontSize: `${
                fontSize ? fontSize : selector.miniCardtextStyle.fontSize
              }px`,
              lineHeight: `${
                lineHeight ? lineHeight : selector.miniCardtextStyle.lineHeight
              }px`,
              color: inputCardtext.colorType,
              fontStyle: inputCardtext.fontStyle,
              fontWeight: inputCardtext.fontWeight,
              textAlign: inputCardtext.textAlign,
            }
          }
        />
      </Slate>
    </div>
  )
}

export default MiniCardtext
