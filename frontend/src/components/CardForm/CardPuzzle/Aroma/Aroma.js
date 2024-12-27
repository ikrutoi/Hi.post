import './Aroma.scss'
import AromaElement from './AromaElement/AromaElement'
import aromaList from '../../../../data/aromaList.json'

const Aroma = () => {
  return (
    <div className="aroma">
      {aromaList
        .sort((name1, name2) => (name1.make > name2.make ? 1 : -1))
        .map((el, i) => (
          <AromaElement make={el.make} name={el.name} key={i} />
        ))}
    </div>
  )
}

export default Aroma
