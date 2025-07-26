import './SpanCircle.scss'

const SpanCircle = ({ name, hover, listSelectedSections }) => {
  const listWithoutNumberingSelectedSections = listSelectedSections.map(
    (section) => section.split('-')[1]
  )
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
        listWithoutNumberingSelectedSections.filter(
          (section) => section === name
        ).length === 0
          ? ''
          : 'selected'
      }`}
    />
  )
}

export default SpanCircle
