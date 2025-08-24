export type Cardtext = {
  text: {
    type: string
    children: { text: string }[]
  }[]
  colorName: string
  colorType: string
  font: string
  fontSize: number
  fontStyle: string
  fontWeight: number
  textAlign: string
  lineHeight: number | null
  miniCardtextStyle: {
    maxLines: number | null
    fontSize: number | null
    lineHeight: number | null
  }
}

export type Address = {
  street: string
  zip: string
  city: string
  country: string
  name: string
}

export type PostcardState = {
  aroma: string | null
  date: string | null
  cardphoto: {
    url: string | null
    source: string | null
  }
  cardtext: Cardtext
  envelope: {
    sender: Address
    recipient: Address
  }
}
