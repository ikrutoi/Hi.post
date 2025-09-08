import { SizeCard } from '@shared/layoutLegacy/model'
import {
  ChoiceSection,
  ChoiceClip,
} from '@shared/layoutLegacy/model/layoutTypes'

export interface CardphotoProps {
  sizeCard: SizeCard
  choiceSection: ChoiceSection
  choiceClip: ChoiceClip
}

export interface ImageCropProps {
  sizeCard: SizeCard
}
