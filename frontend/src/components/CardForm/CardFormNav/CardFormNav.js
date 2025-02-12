import { useRef } from 'react'
import { useSelector } from 'react-redux'
import Toolbar from './Toolbar/Toolbar'
import ToolbarDate from './Toolbar/ToolbarDate/ToolbarDate'
import './CardFormNav.scss'

const CardFormNav = ({ toolbarColor, setToolbarColorActive }) => {
  const sectionDate = useSelector((state) => state.cardEdit.date)
  const layoutChoiceSection = useSelector((state) => state.layout.choiceSection)
  const sizeCard = useSelector((state) => state.layout.sizeCard)

  const cardFormNavRef = useRef(null)

  const section = (name) => {
    switch (name) {
      case 'cardphoto':
        return <Toolbar nameSection={name} />
      case 'cardtext':
        return (
          <Toolbar
            nameSection={name}
            toolbarColor={toolbarColor}
            setToolbarColorActive={setToolbarColorActive}
          />
        )
      case 'date':
        if (sectionDate) {
          return <ToolbarDate choice={true} />
        } else {
          return <ToolbarDate choice={false} />
        }

      default:
        break
    }
  }

  return (
    <div
      ref={cardFormNavRef}
      className="card-form-nav"
      style={{ width: `${sizeCard.width}px` }}
    >
      {section(layoutChoiceSection.nameSection)}
    </div>
  )
}

export default CardFormNav
