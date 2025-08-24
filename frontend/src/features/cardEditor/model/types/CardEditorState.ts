import type { Cardtext } from './Cardtext'
import type { Address } from './Address'

export type CardEditorState = {
  aroma: { value: string | null }
  date: { value: string | null }
  cardphoto: { value: { url: string | null; source: string | null } }
  cardtext: { value: Cardtext }
  envelope: { value: { sender: Address; recipient: Address } }
}
