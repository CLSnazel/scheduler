import { useState } from 'react';

const useVisualMode = function(initMode) {
  const [mode, setMode] = useState(initMode);
  const [history, setHistory] = useState([initMode]);
  
  const transition = (newMode, replace = false) => {
    if (replace) {
      history[history.length - 1] = newMode;
      setMode(newMode);
    } else {
      setHistory([
        ...history,
        newMode
      ]);
      setMode(newMode);
    }
  }

  const back = () => {
    if (history.length > 1) {
      history.pop(); //<---bad. mutable.
      // setHistory(history.slice(history.length - 2))
      const backTo = history[history.length - 1];
      setMode(backTo);
    }
  }
  return {mode, transition, back}
}

export default useVisualMode;