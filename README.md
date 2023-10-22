# Bugzy React SDK

React SDK for Bugzy. A Tool to collect bugs, user feedback and queries for your next big thing.

## Getting started

### Installation

Using `npm`

```bash
npm install bugzy-react
```

using `yarn`

```bash
yarn add bugzy-react
```

### Get your project token

> TODO

### Adding Bugzy to your Project

`bugzy-react` gives out a component that can be placed anywhere in your project/tree. It is a fully contolled React component, so you decide when and how you wanna open it

Lets see an example:

```tsx
import { useState } from "react";

import "./App.css";
// importing bugzy
import { BugzyComponent } from "bugzy-react";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const onCloseHandler = () => {
    // Do something when the Bugzy closes
  };
  return (
    <div>
      <BugzyComponent
        isOpen={isOpen}
        setOpen={setIsOpen}
        onClose={onCloseHandler}
      />
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setIsOpen(true)}>Collect Feedback</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
```

## API Reference for `BugzyComponent`

### Simple `Button` props

| Prop      |    Type    |    Default     | Description                                                                                                                   |
| :-------- | :--------: | :------------: | :---------------------------------------------------------------------------------------------------------------------------- |
| isOpen    | `boolean`  | `empty string` | Renders when the `TextBox` is                                                                                                 |
| setIsOpen | `function` |   `() => ()`   | A callback funtion to set the `isOpen` state in your app                                                                      |
| onClose   | `function` |   `() => {}`   | A callback funtion called when bugzy's modal closes. Usefull when you wanna fire an event of some sort when bugzy closes down |

#### Write to us!

Let us know if this README.md was useful or the things that you think are missing from it :)
