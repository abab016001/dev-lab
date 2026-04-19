import { useGlobalStore } from "./store/useGlobalStore";
import V1 from "./pages/v1";
import V2 from "./pages/v2";
import GlobalPage from "./pages/globalPage";
function App() {
  const page = useGlobalStore((state) => state.page);
  return <>
    {page === 1 && <V1 />}
    {page === 2 && <V2 />}
    <GlobalPage />
  </>
}

export default App;