import { useState } from "react";

export default function Counter({ initial = 0, step = 1 }) {
  const [count, setCount] = useState(initial);

  return <button onClick={() => setCount(count + step)}>點我: {count}</button>
}