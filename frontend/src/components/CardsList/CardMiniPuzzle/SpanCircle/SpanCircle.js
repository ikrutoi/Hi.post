import './SpanCircle.scss'

const SpanCircle = ({ name, hover, listSelectedSections }) => {
  return (
    <span
      className={`card-mini-circle circle-${name} ${
        !!hover &&
        name === hover.toLowerCase() &&
        !document
          .querySelector(`.circle-${name}`)
          .classList.contains('selected')
          ? 'hover'
          : ''
      } ${
        listSelectedSections.filter((section) => section === name).length === 0
          ? ''
          : 'selected'
      }`}
    />
  )
}

export default SpanCircle
