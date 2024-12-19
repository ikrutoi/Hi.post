import './BtnNav.css'

const BtnNav = (props) => {
  const handleBtnNav = () => {
    console.log(props.nameNav)
  }
  return (
    <button type="button" className="btn-nav" onClick={handleBtnNav}>
      {props.nameNav}
    </button>
  )
}

export default BtnNav
