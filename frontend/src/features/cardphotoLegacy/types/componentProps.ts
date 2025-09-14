import { SizeCard } from 'shared-legacy/layoutLegacy/model'
import {
  ChoiceSection,
  ChoiceClip,
} from 'shared-legacy/layoutLegacy/model/layoutTypes'

export interface CardphotoProps {
  sizeCard: SizeCard
  choiceSection: ChoiceSection
  choiceClip: ChoiceClip
}

export interface ImageCropProps {
  sizeCard: SizeCard
}
