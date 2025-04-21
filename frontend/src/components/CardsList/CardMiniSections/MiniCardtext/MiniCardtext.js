import { useSelector } from 'react-redux'
import { useEffect, useMemo, useRef, useState } from 'react'
import './MiniCardtext.scss'
import { Editable, Slate, withReact } from 'slate-react'
import { createEditor } from 'slate'
// import sizeBase from '../../../../data/ratioCardCardMini.json'

const MiniCardtext = ({ cardMiniSectionRef }) => {
  const selectorCardEditCardtext = useSelector(
    (state) => state.cardEdit.cardtext
  )
  console.log('cardtext', selectorCardEditCardtext)
  const inputCardtext =
    selectorCardEditCardtext && selectorCardEditCardtext.lineHeight
      ? selectorCardEditCardtext
      : null
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

  const [maxLines, setMaxLines] = useState(
    selectorCardEditCardtext.miniCardtextStyle.maxLines
  )
  const [lineHeight, setLineHeight] = useState(
    selectorCardEditCardtext.miniCardtextStyle.lineHeight
  )
  const [fontSize, setFontSize] = useState(
    selectorCardEditCardtext.miniCardtextStyle.fontSize
  )

  useEffect(() => {
    if (
      selectorCardEditCardtext &&
      JSON.stringify(selectorCardEditCardtext.text) !== JSON.stringify(value)
    ) {
      miniEditor.children = selectorCardEditCardtext.text
      setValue(selectorCardEditCardtext.text)
      setMaxLines(selectorCardEditCardtext.miniCardtextStyle.maxLines)
    }
  }, [selectorCardEditCardtext, miniEditor, value])

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
  }, [
    maxLines,
    cardMiniSectionRef,
    selectorCardEditCardtext.miniCardtextStyle.maxLines,
  ])

  return (
    <div className="mini-editor">
      <Slate editor={miniEditor} initialValue={inputCardtext.text}>
        <Editable
          readOnly={true}
          style={
            inputCardtext && {
              fontSize: `${
                fontSize
                  ? fontSize
                  : selectorCardEditCardtext.miniCardtextStyle.fontSize
              }px`,
              lineHeight: `${
                lineHeight
                  ? lineHeight
                  : selectorCardEditCardtext.miniCardtextStyle.lineHeight
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
