import { useStore } from "@nanostores/react";
import { $sharedText } from "../textStore";

export default function ReactInput() {
  const text = useStore($sharedText);

  return (
  <div className="p-4 border-2 border-blue-500">
    <h3>React 元件</h3>
    <input 
      type="text"
      value={text}
      onChange={(e) => $sharedText.set(e.target.value)}
      className="text-black p-1"
     />
  </div>
  )
}