export function visitChildren (arr, callback) {
  for (const value of arr) {
    callback(value)
    if (value.children) {
      visitChildren(value.children, callback)
    }
  }
}
