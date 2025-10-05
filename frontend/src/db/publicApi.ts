import { cardtextAdapter } from './adapters/card/cardtextAdapter'
import { recipientAddressAdapter } from './adapters/card/recipientAddressAdapter'
import { senderAddressAdapter } from './adapters/card/senderAddressAdapter'
import { stockImagesAdapter } from './adapters/card/stockImagesAdapter'
import { userImagesAdapter } from './adapters/card/userImagesAdapter'

export const db = {
  card: {
    cardtext: cardtextAdapter,
    recipientAddress: recipientAddressAdapter,
    senderAddress: senderAddressAdapter,
  },
  image: {
    stock: stockImagesAdapter,
    user: userImagesAdapter,
  },
}
