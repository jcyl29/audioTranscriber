import React, { useState } from 'https://esm.sh/react@18.3.1?dev';
import htm from 'https://esm.sh/htm@3.1.1';

const html = htm.bind(React.createElement);

const MyComponent = () => {
  const [count, setCount] = useState(0);
  const onClick = evt => {
    setCount(count + 1);
  };

  return html`
    <button onClick=${onClick}>Click me. Click count ${count}</button>`;
};

export default MyComponent;