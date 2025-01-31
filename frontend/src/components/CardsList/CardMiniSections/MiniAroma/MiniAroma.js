import './MiniAroma.scss'

const MiniAroma = ({ valueSection }) => {
  return (
    <>
      <span>{valueSection.make}</span>
      <span>{valueSection.name}</span>
    </>
  )
}

export default MiniAroma
