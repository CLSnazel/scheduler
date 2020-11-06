import { useState } from 'react';

const useVisualMode = function(initMode) {
  const [mode, setMode] = useState(initMode);
  const [history, setHistory] = useState([initMode]);
  
  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory(prev => [
        ...prev.filter((_, i) => i < (prev.length - 1)),
        newMode
      ]);
      setMode(newMode);
    } else {
      setHistory(prev => [
        ...prev,
        newMode
      ]);
      setMode(newMode);
    }
  }

  const back = () => {
    if (history.length > 1) {
      setHistory(prev => {
        setMode(prev[prev.length - 2]);
        return [...prev.filter( (_, i) => i !== prev.length - 1)]
      })

    }
  }
  return {mode, transition, back}
}

export default useVisualMode;