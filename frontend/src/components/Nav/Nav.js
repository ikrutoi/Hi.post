import BtnNav from '../BtnNav/BtnNav'
import navList from '../../data/navList.json'
import './Nav.css'

const Nav = () => {
  return (
    <div className="nav">
      {navList.map((name, i) => (
        <BtnNav nameNav={name} key={i} />
      ))}
    </div>
  )
}

export default Nav