import './Cardtext.scss'
import Toolbar from './Toolbar/Toolbar'
import CardEditor from './CardEditor/CardEditor'

const Cardtext = () => {
  return (
    <div className="cardtext">
      <Toolbar />
      <CardEditor />
    </div>
  )
}

export default Cardtext
