// main.js
import React from 'https://esm.sh/react@18.3.1?dev'
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client?dev'
import htm from 'https://esm.sh/htm@3.1.1'

const html = htm.bind(React.createElement)

import Header from './Header.js'
import UploadAudio from './UploadAudio.js'
import MainTable from './MainTable.js'
import TranscriptViewer from './TranscriptViewer.js'
import { AppProvider } from '../appContext.js'
import ErrorDialog from './ErrorDialog.js'
import ApiKeyDialog from './ApiKeyDialog.js'

const App = () =>
  html`
    <${AppProvider}>
      <${Header} />
      <${UploadAudio} />
      <${MainTable} />
      <${TranscriptViewer} />
      <${ErrorDialog} />
      <${ApiKeyDialog} />
      <footer><a href="/live_transcribe.html">Go to Live Transcribe</a></footer>
    <//>`

// new way to React render from a root element (React 18)
const root = createRoot(document.getElementById('root'))
root.render(html` <${App} />`)
