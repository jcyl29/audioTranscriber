import React from 'https://esm.sh/react@18.3.1?dev'
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client?dev'
import htm from 'https://esm.sh/htm@3.1.1'
import {
  createClient,
  LiveTranscriptionEvents,
} from 'https://esm.sh/@deepgram/sdk@3.5.0'

const html = htm.bind(React.createElement)

import {
  LiveTranscribeProvider,
  useLiveTranscribe,
} from '../LiveTranscribeContext.js'

let mediaRecorder
let connection
let micStream

const apiKey = localStorage.getItem('apiKey')

const live = async (setRows) => {
  const deepgram = createClient(apiKey)

  connection = deepgram.listen.live({
    model: 'nova-2',
    language: 'en-US',
    smart_format: true,
  })

  connection.on(LiveTranscriptionEvents.Open, async () => {
    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log('Connection closed.')
    })

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      const transcript = data.channel.alternatives[0].transcript
      if (transcript) {
        setRows((rows) => {
          return {
            ...rows,
            [data.start]: {
              transcript,
            },
          }
        })
      }
      console.info('data:', data)
      // {
      //     "type": "Results",
      //     "channel_index": [
      //         0,
      //         1
      //     ],
      //     "duration": 3.2100067,
      //     "start": 108.27,
      //     "is_final": true,
      //     "speech_final": true,
      //     "channel": {
      //         "alternatives": [
      //             {
      //                 "transcript": "help but feel like I was hearing the remains of a lost tribe.",
      //                 "confidence": 0.9980469,
      //                 "words": [
      //                     {
      //                         "word": "help",
      //                         "start": 108.59,
      //                         "end": 108.75,
      //                         "confidence": 0.9980469,
      //                         "punctuated_word": "help"
      //                     },
      //                     {
      //                         "word": "but",
      //                         "start": 108.75,
      //                         "end": 108.909996,
      //                         "confidence": 0.96533203,
      //                         "punctuated_word": "but"
      //                     },
      //                     {
      //                         "word": "feel",
      //                         "start": 108.909996,
      //                         "end": 109.149994,
      //                         "confidence": 1,
      //                         "punctuated_word": "feel"
      //                     },
      //                     {
      //                         "word": "like",
      //                         "start": 109.149994,
      //                         "end": 109.189995,
      //                         "confidence": 0.9980469,
      //                         "punctuated_word": "like"
      //                     },
      //                     {
      //                         "word": "i",
      //                         "start": 109.189995,
      //                         "end": 109.229996,
      //                         "confidence": 0.97998047,
      //                         "punctuated_word": "I"
      //                     },
      //                     {
      //                         "word": "was",
      //                         "start": 109.229996,
      //                         "end": 109.549995,
      //                         "confidence": 0.97314453,
      //                         "punctuated_word": "was"
      //                     },
      //                     {
      //                         "word": "hearing",
      //                         "start": 109.549995,
      //                         "end": 109.78999,
      //                         "confidence": 1,
      //                         "punctuated_word": "hearing"
      //                     },
      //                     {
      //                         "word": "the",
      //                         "start": 109.78999,
      //                         "end": 109.95,
      //                         "confidence": 1,
      //                         "punctuated_word": "the"
      //                     },
      //                     {
      //                         "word": "remains",
      //                         "start": 109.95,
      //                         "end": 110.229996,
      //                         "confidence": 0.99902344,
      //                         "punctuated_word": "remains"
      //                     },
      //                     {
      //                         "word": "of",
      //                         "start": 110.229996,
      //                         "end": 110.509995,
      //                         "confidence": 1,
      //                         "punctuated_word": "of"
      //                     },
      //                     {
      //                         "word": "a",
      //                         "start": 110.509995,
      //                         "end": 110.59,
      //                         "confidence": 0.9951172,
      //                         "punctuated_word": "a"
      //                     },
      //                     {
      //                         "word": "lost",
      //                         "start": 110.59,
      //                         "end": 110.909996,
      //                         "confidence": 1,
      //                         "punctuated_word": "lost"
      //                     },
      //                     {
      //                         "word": "tribe",
      //                         "start": 110.909996,
      //                         "end": 111.409996,
      //                         "confidence": 0.83203125,
      //                         "punctuated_word": "tribe."
      //                     }
      //                 ]
      //             }
      //         ]
      //     },
      //     "metadata": {
      //         "request_id": "a16f0326-0623-4494-bab9-320a2467c205",
      //         "model_info": {
      //             "name": "2-general-nova",
      //             "version": "2024-01-18.26916",
      //             "arch": "nova-2"
      //         },
      //         "model_uuid": "c0d1a568-ce81-4fea-97e7-bd45cb1fdf3c"
      //     },
      //     "from_finalize": false
      // }
    })

    connection.on(LiveTranscriptionEvents.Metadata, (data) => {
      console.log(data)
    })

    connection.on(LiveTranscriptionEvents.Error, (err) => {
      console.error(err)
    })

    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      const systemStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
      })

      const audioContext = new AudioContext()
      const micSource = audioContext.createMediaStreamSource(micStream)
      let systemSource

      if (systemStream.getAudioTracks().length > 0) {
        systemSource = audioContext.createMediaStreamSource(systemStream)
      } else {
        console.warn('No audio tracks in system stream.')
        systemSource = audioContext.createMediaStreamSource(micStream)
      }
      const destination = audioContext.createMediaStreamDestination()
      micSource.connect(destination)
      systemSource.connect(destination)

      const combinedStream = destination.stream
      mediaRecorder = new MediaRecorder(combinedStream)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          connection.send(event.data)
        }
      }

      mediaRecorder.start(250) // Send audio chunks every 250ms
    } catch (err) {
      console.error('Error accessing microphone or system audio:', err)
    }
  })
}

const stopListening = () => {
  if (mediaRecorder) {
    mediaRecorder.stop()
  }
  if (connection) {
    connection.send(JSON.stringify({ type: 'CloseStream' }))
  }

  if (micStream) {
    micStream.getTracks().forEach((track) => track.stop())
  }
}

const App = () => {
  const { rows, setRows } = useLiveTranscribe()

  const onCopyRow = async (event) => {
    event.preventDefault()
    const row = event.target.closest('.live-transcript-row')
    const spanEl = row.firstChild
    const range = document.createRange()
    range.selectNodeContents(spanEl)

    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    try {
      await navigator.clipboard.writeText(selection.toString())
      console.log('Text copied to clipboard')
    } catch (err) {
      // from Firefox 76, clipboard.writeText must be called from a user-generated
      // action, like a click event. Otherwise, it will throw an error.
      console.error('Failed to copy text: ', err)
    }
  }
  const drawRows = () => {
    return Object.entries(rows).map(([key, values]) => {
      return html` <div className="live-transcript-row" data-start=${key}>
        <span>${values.transcript}</span>
        <a href="#" className="copy-row-button" onClick=${onCopyRow}
          >Copy row</a
        >
      </div>`
    })
  }

  return html`
    <div>
      <button onClick=${() => live(setRows)}>Start Live Transcription</button>
      <button onClick=${() => stopListening()}>Stop Listening</button>
      <h2>Live Transcription</h2>
      <section>${drawRows()}</section>
    </div>
  `
}

const root = createRoot(document.getElementById('root'))
root.render(html`
  <${LiveTranscribeProvider}>
    <${App} />
  </${LiveTranscribeProvider}>`)
