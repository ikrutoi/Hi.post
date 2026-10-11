import clsx from 'clsx'
import { IconPrinter } from '@shared/ui/icons'
import { CropQualityMeter } from './CropQualityMeter'
import { useCropQualityFill } from './useCropQualityFillColor'
import styles from './CardphotoPrintQualitySlot.module.scss'

type Props = {
  disabled?: boolean
  /** Stretch meter to parent width (upper toolbar = central CardPie). */
  fillWidth?: boolean
}

export const CardphotoPrintQualitySlot: React.FC<Props> = ({
  disabled = false,
  fillWidth = false,
}) => {
  const { color } = useCropQualityFill(disabled)

  return (
    <div className={clsx(styles.root, fillWidth && styles.rootFill)}>
      <CropQualityMeter disabled={disabled} fillWidth={fillWidth} />
      <span
        className={clsx(styles.printer, disabled && styles.printerDisabled)}
        style={color ? { color } : undefined}
        aria-hidden
      >
        <IconPrinter />
      </span>
    </div>
  )
}
