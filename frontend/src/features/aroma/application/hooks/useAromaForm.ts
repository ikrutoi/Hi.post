import { useAromaFacade } from '../facades'

export const useAromaForm = () => {
  const { selectedAroma, actions } = useAromaFacade()

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault()
    if (selectedAroma) {
      actions.selectAroma(selectedAroma)
    }
  }

  return { handleSubmit }
}
