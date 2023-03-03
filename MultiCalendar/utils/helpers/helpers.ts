export const isTabletRes = (): boolean => {
  if (window.innerWidth < 992) {
    return true
  }
  return false
}
