import { useEffect, useState } from 'react'
import './ToolbarShopping.scss'

const ToolbarShopping = ({ day, shoppingDay }) => {
  const [countShoppingCards, setCountShoppingCards] = useState(null)

  useEffect(() => {
    if (shoppingDay.length > 1) {
      setCountShoppingCards(shoppingDay.length)
    }
    if (shoppingDay.length === 1) {
      setCountShoppingCards(false)
    }
  }, [shoppingDay])

  return (
    <div className="toolbar-shopping">
      <div className="toolbar-shopping-cell">{day}</div>
      <img
        className="toolbar-shopping-img cell-shopping-img "
        alt="shopping-day"
        src={shoppingDay?.[0]?.img}
      />
      {countShoppingCards && (
        <span className="toolbar-shopping-count">{shoppingDay.length}</span>
      )}
    </div>
  )
}

export default ToolbarShopping
