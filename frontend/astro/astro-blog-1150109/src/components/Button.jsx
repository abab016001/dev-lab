import { $counter } from "../store";

export default function Button() {
  return (
    <button onClick={() => $counter.set($counter.get() + 1)}>
      加1
    </button>
  )
}