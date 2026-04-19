import { useGlobalStore } from "../store/useGlobalStore";
import GameOverModal from "../components/modal/GameOverModal";
export default function GlobalPage() {
  const page = useGlobalStore(state => state.globalPage);
  return <>
    {page === "GameOver" && <GameOverModal />}
  </>
}