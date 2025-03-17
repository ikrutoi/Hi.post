import './Cardtext.scss'
import CardEditor from './CardEditor/CardEditor'

const Cardtext = ({ toolbarColor, setChoiceSection, styleLeftCardPuzzle }) => {
  return (
    <div className="cardtext">
      <CardEditor
        toolbarColor={toolbarColor}
        setChoiceSection={setChoiceSection}
        styleLeftCardPuzzle={styleLeftCardPuzzle}
      />
    </div>
  )
}

export default Cardtext
