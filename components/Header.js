import React from 'https://esm.sh/react@18.3.1?dev'
import htm from 'https://esm.sh/htm@3.1.1'
const html = htm.bind(React.createElement)

const Header = () => {
  return html`<h1 className="header">Prerecorded audio transcription server</h1>`
}

export default Header
