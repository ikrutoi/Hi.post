import './Tooltip.scss'

const Tooltip = ({ tooltip }) => {
  return <span className="toolbar-tooltip">{tooltip.text}</span>
}

export default Tooltip
