import './Cardtext.scss'
import CardEditor from './CardEditor/CardEditor'
// import Toolbar from './Toolbar/Toolbar'

const Cardtext = ({
  toolbarColor,
  setChoiceSection,
  // choiceBtnNav
}) => {
  return (
    <div className="cardtext">
      {/* <Toolbar editor={editor} /> */}
      <CardEditor
        toolbarColor={toolbarColor}
        setChoiceSection={setChoiceSection}
        // setToolbarColorActive={setToolbarColorActive}
        // choiceBtnNav={choiceBtnNav}
      />
    </div>
  )
}

export default Cardtext
