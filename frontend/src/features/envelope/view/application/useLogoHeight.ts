import { useEffect } from 'react'

type UseLogoHeightParams = {
  cardPuzzleRef: React.RefObject<HTMLDivElement>
  setHeightLogo: React.Dispatch<React.SetStateAction<number | null>>
}

export const useLogoHeight = ({
  cardPuzzleRef,
  setHeightLogo,
}: UseLogoHeightParams) => {
  useEffect(() => {
    if (cardPuzzleRef?.current) {
      const height = cardPuzzleRef.current.clientHeight
      setHeightLogo(height / 14)
    }
  }, [cardPuzzleRef])
}
