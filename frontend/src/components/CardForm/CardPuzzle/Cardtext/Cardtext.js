import './Cardtext.scss'
import CardEditor from './CardEditor/CardEditor'
// import Toolbar from './Toolbar/Toolbar'

const Cardtext = ({
  toolbarColor,
  // choiceBtnNav
}) => {
  return (
    <div className="cardtext">
      {/* <Toolbar editor={editor} /> */}
      <CardEditor
        toolbarColor={toolbarColor}
        // setToolbarColorActive={setToolbarColorActive}
        // choiceBtnNav={choiceBtnNav}
      />
    </div>
  )
}

export default Cardtext
