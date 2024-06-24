import React from 'https://esm.sh/react@18.3.1?dev'
import htm from 'https://esm.sh/htm@3.1.1'
import { useApp } from '../appContext.js'
// import Skeleton from 'https://esm.sh/react-loading-skeleton@3.4.0'
const html = htm.bind(React.createElement)

const TranscriptViewer = () => {
  const { rows, transcriptViewerKey } = useApp()

  let fileName = ''
  let transcript = ''
  if (transcriptViewerKey) {
    fileName = rows[transcriptViewerKey].name
    transcript = rows[transcriptViewerKey].transcript
  }

  const onChange = (e) => {
    console.log('onChange', e.target.value)
  }

  return html`
    <div className="transcript-viewer">
      <h4 className="label">Transcript: ${fileName}</h4>
      <textarea
        className="textarea"
        placeholder="Click transcribe to see transcription"
        onChange=${onChange}
        value=${transcript}
      ></textarea>
    </div>`
}

export default TranscriptViewer
