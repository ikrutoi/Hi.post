import BtnNav from '../BtnNav/BtnNav'
import navList from '../../data/navList.json'
import './Nav.scss'

const Nav = ({ onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <div className="nav">
      {navList.map((name, i) => (
        <BtnNav
          nameNav={name}
          key={i}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          dataName
        />
      ))}
    </div>
  )
}

export default Nav
