addIndexDb: (
  state,
  action: PayloadAction<{
    stockImages?: Partial<ImageSet>
    userImages?: Partial<ImageSet>
  }>
) => {
  state.indexDb.stockImages = {
    ...state.indexDb.stockImages,
    ...action.payload.stockImages,
  }
  state.indexDb.userImages = {
    ...state.indexDb.userImages,
    ...action.payload.userImages,
  }
}
