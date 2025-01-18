import './Cardtext.scss'
import CardEditor from './CardEditor/CardEditor'
// import Toolbar from './Toolbar/Toolbar'

const Cardtext = () => {
  return (
    <div className="cardtext">
      {/* <Toolbar editor={editor} /> */}
      <CardEditor />
    </div>
  )
}

export default Cardtext
