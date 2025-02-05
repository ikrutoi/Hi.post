import { useSelector } from 'react-redux'
import { useEffect, useMemo, useRef, useState } from 'react'
import './MiniCardtext.scss'
import { Editable, Slate, withReact } from 'slate-react'
import { createEditor } from 'slate'
// import sizeBase from '../../../../data/ratioCardCardMini.json'

const MiniCardtext = ({ cardMiniSectionRef }) => {
  const selector = useSelector((state) => state.cardEdit.cardtext)
  const inputCardtext = selector && selector.lineHeight ? selector : null
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

  const [maxLines, setMaxLines] = useState(selector.miniCardtextStyle.maxLines)
  const [lineHeight, setLineHeight] = useState(
    selector.miniCardtextStyle.lineHeight
  )
  const [fontSize, setFontSize] = useState(selector.miniCardtextStyle.fontSize)

  useEffect(() => {
    if (selector && JSON.stringify(selector.text) !== JSON.stringify(value)) {
      miniEditor.children = selector.text
      setValue(selector.text)
      setMaxLines(selector.miniCardtextStyle.maxLines)
    }
  }, [selector, miniEditor, value])

  useEffect(() => {
    if (cardMiniSectionRef) {
      const totalHeightCardmini = cardMiniSectionRef.clientHeight
      const computedStyle = window.getComputedStyle(cardMiniSectionRef)
      const paddingTop = parseFloat(computedStyle.paddingTop)
      const paddingBottom = parseFloat(computedStyle.paddingBottom)
      const heightCardMini = totalHeightCardmini - paddingTop - paddingBottom

      setLineHeight((heightCardMini / maxLines).toFixed(2))
      setFontSize((heightCardMini / maxLines / 1.35).toFixed(2))
    }
  }, [maxLines, cardMiniSectionRef, selector.miniCardtextStyle.maxLines])

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
