import type { AromaItem } from '../types/aroma.types'

/** 3×3: No Aroma, три слота с новой серией изображений (101_01…), пять пустых без картинок. */
export const AROMA_LIST: AromaItem[] = [
  { make: '0', name: 'No Aroma', index: '00' },
  { make: 'Nasomatto', name: 'Black Afgano', index: '101_01' },
  { make: 'Giorgio Armani', name: 'Acqua Di Gio Profondo', index: '102_01' },
  { make: 'Bvlgari', name: 'Man Terrae Essence', index: '103_01' },
  { make: '', name: '', index: '__e1' },
  { make: '', name: '', index: '__e2' },
  { make: '', name: '', index: '__e3' },
  { make: '', name: '', index: '__e4' },
  { make: '', name: '', index: '__e5' },
]
