import { updateName } from "../store";

export default function InputName() {
  return (
    <input type="text" onChange={(value) => updateName(value)} />
  )
}