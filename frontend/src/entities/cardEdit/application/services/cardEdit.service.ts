export const saveCardEdit = async (cardData: unknown) => {
  try {
    const response = await fetch('/api/card/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData),
    })
    return await response.json()
  } catch (error) {
    console.error('Error saving card:', error)
    throw error
  }
}
