export const handleFileChange = (e, setImage, setOriginalImage) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      const imageDataUrl = reader.result
      setImage({ source: 'startUserImage', url: imageDataUrl })
      setOriginalImage(imageDataUrl)
    }
    reader.readAsDataURL(file)
  }
}
