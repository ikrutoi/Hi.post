export const handleFileChange = (
  e,
  setImage,
  setOriginalImage,
  dispatch,
  addOriginalImage,
  setModeCrop
) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      const imageDataUrl = reader.result
      setImage({ source: 'userImage', url: imageDataUrl })
      setOriginalImage(imageDataUrl)
      setModeCrop('startCrop')
      dispatch(addOriginalImage(imageDataUrl))
      // dispatch(addCardphoto({ source: 'userImage', url: imageDataUrl }))
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }
}
