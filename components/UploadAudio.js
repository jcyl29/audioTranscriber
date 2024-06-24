import React, { useRef } from 'https://esm.sh/react@18.3.1?dev'
import htm from 'https://esm.sh/htm@3.1.1'
import { getAudioDuration, getFileMetadata } from '../helpers.js'
import { useApp } from '../appContext.js'
import newRow from '../templates/rowState.js'

const html = htm.bind(React.createElement)

const UploadAudio = () => {
  const { setRows } = useApp()

  const inputRef = useRef()
  const buttonOnClick = () => {
    inputRef.current.click()
  }

  const inputOnChange = async (e) => {
    const file = e.target.files[0]
    const fileAsObjUrl = URL.createObjectURL(file)
    const { name, sizeInBytes } = getFileMetadata(file)
    const duration = await getAudioDuration(fileAsObjUrl)
    setRows((rows) => {
      return {
        ...rows,
        [crypto.randomUUID()]: {
          ...newRow,
          name,
          sizeInBytes,
          duration,
          fileAsObjUrl,
        },
      }
    })
  }

  return html` <div className="box flex-end">
    <input
      type="file"
      id="upload-audio-input"
      accept="audio/*"
      className="hide"
      ref=${inputRef}
      onChange=${inputOnChange}
    />
    <button className="button button-primary" onClick="${buttonOnClick}">
      Upload a file
    </button>
  </div>`
}

export default UploadAudio
