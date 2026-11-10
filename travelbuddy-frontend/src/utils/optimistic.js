export function runOptimistic({ apply, request, confirm }) {
  const undo = apply()
  return Promise.resolve().then(request).then(response => { confirm?.(response?.data ?? response); return response }).catch(error => { undo(); throw error })
}
