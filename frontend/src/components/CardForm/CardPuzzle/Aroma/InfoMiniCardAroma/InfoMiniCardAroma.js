import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './InfoMiniCardAroma.scss'
import img00 from '../../../../../data/aroma/no-parfum.png'
import img10 from '../../../../../data/aroma/nasomatto__black_afgano__10.png'
import img11 from '../../../../../data/aroma/giorgio_armani__acqua_di_gio_profondo__11.png'
import img12 from '../../../../../data/aroma/bvlgari__man_terrae_essence__12.png'
import img13 from '../../../../../data/aroma/jean_paul_gaulier__le_beau_le_parfum__13.png'
import img14 from '../../../../../data/aroma/christian_dior__sauvage_elixir__14.png'
import img15 from '../../../../../data/aroma/creed__aventus__15.png'
import img20 from '../../../../../data/aroma/viktor_&_rolf__flowerbomb_midnight__20.png'
import img21 from '../../../../../data/aroma/versace__versace_pour_femme_dylan_blue__21.png'
import img22 from '../../../../../data/aroma/tom_ford__costa_azurra__22.png'
import img23 from '../../../../../data/aroma/hermes__caleche__23.png'
import img24 from '../../../../../data/aroma/chanel__1957__24.png'
import img25 from '../../../../../data/aroma/carolina_herrera__212__25.png'

const InfoMiniCardAroma = ({
  selectedAroma,
  elementAroma,
  setSelectedAroma,
}) => {
  const selector = useSelector((state) => state.layout)
  const [sizeMiniCard, setSizeMiniCard] = useState(null)

  useEffect(() => {
    if (selector.sizeCard.width && selector.sizeCard.height) {
      setSizeMiniCard({
        height: (selector.sizeCard.height - 6 * selector.remSize) / 4,
        width: (selector.sizeCard.width - 6 * selector.remSize) / 4,
      })
    }
  }, [selector])

  // console.log('el', elementAroma)
  let imageAroma

  switch (elementAroma.index) {
    case '00':
      imageAroma = img00
      break
    case '10':
      imageAroma = img10
      break
    case '11':
      imageAroma = img11
      break
    case '12':
      imageAroma = img12
      break
    case '13':
      imageAroma = img13
      break
    case '14':
      imageAroma = img14
      break
    case '15':
      imageAroma = img15
      break
    case '20':
      imageAroma = img20
      break
    case '21':
      imageAroma = img21
      break
    case '22':
      imageAroma = img22
      break
    case '23':
      imageAroma = img23
      break
    case '24':
      imageAroma = img24
      break
    case '25':
      imageAroma = img25
      break

    default:
      break
  }

  // const selectors = useSelector((state) => state.cardEdit)
  return (
    sizeMiniCard && (
      <button
        className={`info-mini-aroma ${
          !!selectedAroma &&
          selectedAroma.make === elementAroma.make &&
          selectedAroma.name === elementAroma.name
            ? 'selected'
            : ''
        }`}
        type="submit"
        style={{
          width: `${sizeMiniCard.width}px`,
          height: `${sizeMiniCard.height}px`,
        }}
        onClick={() =>
          setSelectedAroma({
            make: elementAroma.make,
            name: elementAroma.name,
            index: elementAroma.index,
            gender: elementAroma.gender,
          })
        }
      >
        <span>{elementAroma.make === '0' ? '\u00A0' : elementAroma.make}</span>
        <img
          className="info-mini-aroma-img"
          alt={elementAroma.name}
          style={{ height: `${0.6 * sizeMiniCard.height}px` }}
          src={imageAroma}
        ></img>
        <span>{elementAroma.name}</span>
      </button>
    )
  )
}

export default InfoMiniCardAroma
