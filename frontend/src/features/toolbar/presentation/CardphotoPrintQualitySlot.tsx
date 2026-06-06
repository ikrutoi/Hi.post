import clsx from 'clsx'
import { IconPrinter } from '@shared/ui/icons'
import { CropQualityMeter } from './CropQualityMeter'
import styles from './CardphotoPrintQualitySlot.module.scss'

type Props = {
  disabled?: boolean
}

export const CardphotoPrintQualitySlot: React.FC<Props> = ({
  disabled = false,
}) => (
  <div className={styles.root}>
    <CropQualityMeter disabled={disabled} />
    <span
      className={clsx(styles.printer, disabled && styles.printerDisabled)}
      aria-hidden
    >
      <IconPrinter />
    </span>
  </div>
)
