export const loadAromaImage = async (index: string): Promise<string | null> => {
  try {
    const image = await import(`../assets/${index}.png`)
    return image.default
  } catch (error) {
    console.warn(`Aroma image not found for index: ${index}`)
    return null
  }
}
