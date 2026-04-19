import { useGlobalStore } from "../store/useGlobalStore";

function V1() {
  const setPage = useGlobalStore((state) => state.setPage);
  const setLevel = useGlobalStore((state) => state.setLevel);
  return <>
    <div className="space-y-5">
      <ul className="flex gap-5">
        <li>
          <label className="space-x-5">
            <input type="radio" name="LEVEL" onClick={() => setLevel(1)} defaultChecked={true} /><b>Level 1</b></label>
        </li>
        <li>
          <label className="space-x-5">
            <input type="radio" name="LEVEL" onClick={() => setLevel(2)} /><b>Level 2</b></label>
        </li>
      </ul>
      <button onClick={() => setPage(2)}>開始遊戲</button>
      <br />
      <button onClick={() => alert('離開遊戲')}>離開遊戲</button>
    </div>
  </>
}

export default V1;