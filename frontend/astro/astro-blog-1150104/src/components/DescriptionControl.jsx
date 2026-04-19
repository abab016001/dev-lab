import { useState } from "react";

export default function DescriptionControl({ description }) {
  const [more, setMore] = useState(false);
  const _click = () => setMore(prev => !prev);
  return (
    <div>
      <p>
        {more ? description : description.substring(0, 20) + "..."}
      </p>
      <button onClick={_click}>
        {more ? "收起" : "閱讀更多"}
      </button>
    </div>
  )
}