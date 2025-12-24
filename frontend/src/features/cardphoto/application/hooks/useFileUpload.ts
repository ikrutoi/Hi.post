export const useFileUpload = (dispatch: any, section: string) => {
  return (key: string) => {
    if (key === 'download') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          const url = URL.createObjectURL(file)
          dispatch({
            type: 'toolbar/action',
            payload: {
              section,
              key,
              payload: {
                id: file.name,
                size: file.size,
                type: file.type,
                url,
                lastModified: file.lastModified,
              },
            },
          })
        }
      }
      input.click()
    } else {
      dispatch({ type: 'toolbar/action', payload: { section, key } })
    }
  }
}
