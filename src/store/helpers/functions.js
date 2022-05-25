import { notify } from 'notiwind'

export function visitChildren (arr, callback) {
  for (const value of arr) {
    callback(value)
    if (value.children) {
      visitChildren(value.children, callback)
    }
  }
}

export function showNotify (notification, notificationSound = true) {
  notify(notification, 30000)
  if (notificationSound) {
    const nt = new Audio(require('@/assets/sounds/notification.mp3'))
    nt.volume = 0.5
    nt.play()
  }
}

export function writeCache (key, blob) {
  if (blob.size > 2_000_000) return // Don't cache if blob size is over 2M
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onloadend = function () {
    const base64data = reader.result
    localStorage.setItem(key, base64data)
  }
}

export function recursiveRemove (arr, uid) {
  return arr.filter(item => {
    if ('children' in item) {
      item.children = recursiveRemove(item.children, uid)
    }
    return item.uid !== uid
  })
}
