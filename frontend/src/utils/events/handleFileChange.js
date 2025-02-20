export const handleFileChange = (
  evt,
  setImage,
  setOriginalImage,
  dispatch,
  addOriginalImage,
  setModeCrop
) => {
  const file = evt.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      const imageDataUrl = reader.result
      setImage({ source: 'userImage', url: imageDataUrl })
      setOriginalImage(imageDataUrl)
      setModeCrop('startCrop')
      dispatch(addOriginalImage(imageDataUrl))
      // dispatch(addCardphoto({ source: 'userImage', url: imageDataUrl }))
      evt.target.value = ''
    }
    reader.readAsDataURL(file)
  }
}
