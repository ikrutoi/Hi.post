import { useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import './MiniCardtext.scss'
import { Editable, Slate, withReact } from 'slate-react'
import { createEditor } from 'slate'

const MiniCardtext = () => {
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

  useEffect(() => {
    if (selector && JSON.stringify(selector.text) !== JSON.stringify(value)) {
      miniEditor.children = selector.text
      setValue(selector.text)
    }
  }, [selector, miniEditor, value])

  return (
    <div className="mini-editor">
      <Slate editor={miniEditor} initialValue={inputCardtext.text}>
        <Editable
          readOnly={true}
          style={
            inputCardtext && {
              fontSize: `${inputCardtext.fontSize * 0.1}px`,
              lineHeight: `${inputCardtext.lineHeight * 0.1}px`,
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
