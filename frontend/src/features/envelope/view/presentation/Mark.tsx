export const Mark: React.FC<{ active?: boolean }> = ({ active = false }) => {
  const image = active ? 'mark-active.svg' : 'mark-not-active.svg'

  return (
    <div className="mark">
      <div
        className="mark__stamp"
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  )
}
