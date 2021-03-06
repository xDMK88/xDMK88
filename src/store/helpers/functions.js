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

function wipeCachedFilesFromLocalStorage () {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
  for (const key in localStorage) {
    if (regexExp.test(key)) {
      localStorage.removeItem(key)
    }
  }
}

export function setLocalStorageItem (key, value) {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    wipeCachedFilesFromLocalStorage()
    localStorage.setItem(key, value)
  }
}

export function writeCache (key, blob) {
  if (blob.size > 2_000_000) return // Don't cache if blob size is over 2M
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onloadend = function () {
    const base64data = reader.result
    setLocalStorageItem(key, base64data)
  }
}

export function recursiveRemove (arr, uid) {
  return arr.filter((item) => {
    if ('children' in item) {
      item.children = recursiveRemove(item.children, uid)
    }
    return item.uid !== uid
  })
}
