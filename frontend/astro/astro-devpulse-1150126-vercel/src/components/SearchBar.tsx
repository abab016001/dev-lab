import { useStore } from "@nanostores/react";
import { searchQuery } from "../store/searchStore";

const SearchBar = () => {
  // 1. 訂閱 Store 的值，當值改變時。組件會重新渲染
  const $searchQuery = useStore(searchQuery);

  //2. 當使用者輸入時，即時更新 Store 的內容
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchQuery.set(e.target.value);
  }

  // 3. 可以手動清空
  const handleClear = () => searchQuery.set('');

  return (
    <div className="flex items-center max-w-md mx-auto border border-gray-300 rounded-lg overflow-hidden">
      <input
        type="text"
        placeholder="搜尋..."
        className="flex-1 px-4 py-2 text-gray-700 focus:outline-none"
        value={$searchQuery}
        onChange={handleChange}
      />
      {
        $searchQuery && (
          <button className="px-4 cursor-pointer" onClick={handleClear}>✕</button>
        )
      }
      <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
        🔍
      </button>
    </div>
  );
}
  
export default SearchBar;
