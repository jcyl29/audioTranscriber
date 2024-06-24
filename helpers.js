const bytes2MegaBytes = (bytes, fractionDigits = 2) => {
  const megaByte = 1024 * 1024
  return (bytes / megaByte).toFixed(fractionDigits)
}

const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getFileMetadata = (file) => {
  if (!file) {
    return {}
  }

  return {
    name: file.name,
    sizeInBytes: file.size,
  }
}

const getAudioDuration = async (fileByObjUrl) => {
  const audio = new Audio()
  audio.src = fileByObjUrl
  await new Promise((resolve) => {
    audio.addEventListener('loadedmetadata', () => {
      resolve()
    })
  })

  return audio.duration
}

const createTextBlobAsObjectUrl = (text) => {
  const textBlob = new Blob([text], { type: 'text/plain' })
  return URL.createObjectURL(textBlob)
}

const getDownloadAttrsForLink = (fileName, textBlobAsObjUrl) => {
  const download = `${fileName}.txt`

  return {
    href: textBlobAsObjUrl,
    download,
  }
}

export {
  bytes2MegaBytes,
  getFileMetadata,
  formatDuration,
  getAudioDuration,
  createTextBlobAsObjectUrl,
  getDownloadAttrsForLink,
}
