import { useRef } from 'react'
import './ImgEditor.scss'
import sizeCard from '../../../../../data/ratioCardCardMini.json'

const ImgEditor = ({ dimensionHeight }) => {
  const heightCard = dimensionHeight * sizeCard.card
  const widthCard = heightCard * 1.42

  const cardphotoEditorRef = useRef(null)

  return (
    <div
      ref={cardphotoEditorRef}
      className="cardphoto-editor"
      style={{ width: `${widthCard}px`, height: `${heightCard}px` }}
    >
      ImgEditor
    </div>
  )
}

export default ImgEditor
