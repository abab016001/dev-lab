import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  const _style = {
    border: '1px solid #ccc',
    padding: '1rem',
    marginTop: '1rem',
  }
  const _click = () => setLikes(likes + 1);
  return (
    <div style={_style}>
      <p>這篇文章對你有幫助嗎？</p>
      <button onClick={_click}>
        ❤️ 點讚 ({likes})
      </button>
    </div>

  );
}