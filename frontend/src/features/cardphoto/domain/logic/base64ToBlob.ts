export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteString = atob(base64.split(',')[1])
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const intArray = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i)
  }

  return new Blob([intArray], { type: mimeType })
}
