import { useState } from 'react';

const useVisualMode = function(initMode) {
  const [mode, setMode] = useState(initMode);
  const [history, setHistory] = useState([initMode]);
  
  const transition = (newMode, replace = false) => {
    // console.log("Before transition: ", history);
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
    // console.log("After transition: ", history);
  }

  const back = () => {
    if (history.length > 1) {
      // console.log("Before back: ", history);
      // history.pop(); //<---bad. mutable.

      //supposedly correct way
      
      setHistory(prev => {
        setMode(prev[prev.length - 2]);
        return [...prev.filter( (_, i) => i !== prev.length - 1)]
      })

      // const backTo = history[history.length - 1];
      // setMode(backTo);
      // console.log("After back: ", history);
    }
  }
  return {mode, transition, back}
}

export default useVisualMode;