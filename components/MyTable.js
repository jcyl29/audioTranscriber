import React from 'https://esm.sh/react@18.3.1?dev'
import htm from 'https://esm.sh/htm@3.1.1'
// import Skeleton from 'https://esm.sh/react-loading-skeleton@3.4.0'
const html = htm.bind(React.createElement)


const MyTable = () => {
  const renderThreeRows = [...Array(3)].map((_, i) => {
    return html`
      <tr key="row_${i}">
        <td >Row ${i}</td>
      </tr>`
  })

  return html`
    <table>
      <thead>
      <tr>
        <th>TableHead</th>
      </tr>
      </thead>
      <tbody>${renderThreeRows}</tbody>
    </table>`
}

export default MyTable