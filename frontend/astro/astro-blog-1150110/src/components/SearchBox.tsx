import { useStore } from "@nanostores/react";
import { $searchQuery, $currentCategory } from "../stores/searchStore";

const categories = ['All', `men's clothing`, 'jewelery', 'electronics', `women's clothing`];

export default function SearchBox() {
  const query = useStore($searchQuery);
  const category = useStore($currentCategory);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-4">
      <input 
        type="text"
        placeholder="搜尋產品..."
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        value={query}
        onChange={(e) => $searchQuery.set(e.target.value)}
       />

       <div className="flex gap-2">
        {
          categories.map(cat => (
            <button
              key={cat}
              onClick={() => $currentCategory.set(cat)}
              className={`
                px-3 py-1 rounded-full text-sm transition
                ${category == cat ? 'bg-blue-600 text-black' : 'bg-amber-400 text-violet-700 hover:bg-slate-200'}
              `}
              >
              {cat}
            </button>
          ))
        }
       </div>

    </div>
  );
}