export const base64ToBlob = (base64: string, mimeType?: string): Blob => {
  const [prefix, data] = base64.split(',')
  if (!data) throw new Error('Invalid base64 format')

  const byteString = atob(data)
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const intArray = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i)
  }

  const inferredMime =
    mimeType ??
    prefix.match(/^data:(.*);base64/)?.[1] ??
    'application/octet-stream'
  return new Blob([intArray], { type: inferredMime })
}
