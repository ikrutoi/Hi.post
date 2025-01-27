import './ToolbarColor.scss'

const ToolbarColor = ({ color, setToolbarColorActive }) => {
  const handleClick = () => {
    setToolbarColorActive(true)
  }
  // console.log('**', tooltip)
  // useEffect(() => {
  //   // if (btnTooltipRef.current) {
  //     const widthBtn = btnTooltipRef.current.offsetWidth
  //     const calcLeft = tooltip.left - widthBtn / 2 + tooltip.widthbtn / 2
  //     setLeftBtnTooltip(calcLeft)
  //     setIsVisibility('visible')
  //   // }
  // }, [tooltip])
  return (
    <div className="toolbar-color" onClick={handleClick}>
      ToolbarColor
    </div>
  )
}

export default ToolbarColor
