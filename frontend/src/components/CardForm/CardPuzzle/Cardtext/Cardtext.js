import './Cardtext.scss'
import CardEditor from './CardEditor/CardEditor'
// import Toolbar from './Toolbar/Toolbar'

const Cardtext = ({ toolbarColor, setToolbarColorActive }) => {
  return (
    <div className="cardtext">
      {/* <Toolbar editor={editor} /> */}
      <CardEditor
        toolbarColor={toolbarColor}
        setToolbarColorActive={setToolbarColorActive}
      />
    </div>
  )
}

export default Cardtext
