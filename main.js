// main.js
// remove ?dev from CDN URLs to use production versions of React
import React from 'https://esm.sh/react@18.3.1?dev';
import ReactDOM from 'https://esm.sh/react-dom@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client?dev';

import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);
import Skeleton from 'https://esm.sh/react-loading-skeleton@3.4.0?dev'

// In ESM (ECMAScript Modules), there isn't a built-in way to import CSS files directly
// like you would in a bundler environment such as Webpack or Parcel.
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://esm.sh/react-loading-skeleton/dist/skeleton.css';
document.head.appendChild(link);


import MyComponent from './MyComponent.js';
import MyTable from './components/MyTable.js';

const App = (props) => {
  return html`
    <div><b>Hello World! </b><i>Foo: ${props.foo}</i><br />
      <${MyComponent} />
      <${MyTable} />
      <${Skeleton} count=${5} />
    </div>`;
};

// no more ReactDOM.render
// https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
const root = createRoot(document.getElementById('root'));
root.render(html`<${App} foo=${'bar'} />`);