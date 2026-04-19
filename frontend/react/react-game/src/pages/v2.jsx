import { useGlobalStore } from "../store/useGlobalStore";
import TicTacToe from "../components/TicTacToe";
function V2() {
  const setPage = useGlobalStore((state) => state.setPage);
  const refreshGame = useGlobalStore((state) => state.refreshGame);
  const step = useGlobalStore((state) => state.step);
  return <>
    <button onClick={() => setPage(1)}>回首頁</button>
    <button onClick={() => refreshGame()}>重新開始</button>
    <strong>步數： {step}</strong>
    <br />
    <div className="p-10">
      九宮格
      <TicTacToe />
    </div>
  </>
}

export default V2;