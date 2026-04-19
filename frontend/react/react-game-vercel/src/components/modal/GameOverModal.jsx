import Popup from "../ui/Popup"
import { useGlobalStore } from "../../store/useGlobalStore"

export default function GameOverModal() {
  const setPage = useGlobalStore(state => state.setPage);
  const gameOver = useGlobalStore(state => state.gameOver);
  const refreshGame = useGlobalStore(state => state.refreshGame);
  const getScore = useGlobalStore(state => state.getScore);
  return <Popup>
    <header>
      遊戲結束
    </header>
    <main>
      {gameOver.winner == "玩家" ? (<p><strong>{getScore()}</strong></p>) : ""}
      {gameOver.msg}
    </main>
    <footer>
      <button onClick={() => setPage(1)}>回首頁</button>
      <button onClick={() => { setPage(2); refreshGame(); }}>再玩一次</button>
    </footer>
  </Popup>
}