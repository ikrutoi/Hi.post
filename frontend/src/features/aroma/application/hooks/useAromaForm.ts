import { useAromaFacade } from '../facades'

export const useAromaForm = () => {
  const { selectedAroma, chooseAroma } = useAromaFacade()

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault()
    if (selectedAroma) {
      chooseAroma(selectedAroma)
    }
  }

  return { handleSubmit }
}
