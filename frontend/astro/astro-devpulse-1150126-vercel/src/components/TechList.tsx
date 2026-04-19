import type { CategoryMap, Tech, TechStatus } from "../type/tech";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { searchQuery } from "../store/searchStore";
import { categoryFilter } from "../store/techStore";

type TechListProps = {
  category: CategoryMap
}

const CategorySection = ({status, items}: {status: string, items: Tech[]}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <section>
            <h2 
              className="flex justify-between items-center text-2xl font-bold capitalize mb-4 border-b border-gray-200 p-2 hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}>
              {status}
              <svg 
                className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </h2>
            <div className={`grid transition-all duration-300 ease-in-out
                ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
              `}>
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((item, index) => (
                    <div key={index} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover: shadow-md transition-shadow">
                      <span className="text-3xl mb-2 block"> {item.data.icon} </span>
                      <h3 className="font-bold"> {item.data.name} </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
    </section>
  )
}

const TechList = function({category}: TechListProps) {
  const $searchQuery = useStore(searchQuery);
  const $categoryFilter = useStore(categoryFilter);

  const allCategory = {
    mastered: category.mastered.filter(item => item.body?.includes($searchQuery)),
    learning: category.learning.filter(item => item.body?.includes($searchQuery)),
    wishlist: category.wishlist.filter(item => item.body?.includes($searchQuery)),
  };

  const filterCategory: CategoryMap = 
  $categoryFilter == 'All' ? allCategory : {[$categoryFilter]: allCategory[$categoryFilter as TechStatus]} as CategoryMap;

  return (
    <div className="grid gap-8">
      {
        Object.entries(filterCategory).map(([status, items]) => (
          <CategorySection status={status} items={items} key={status}/>
        ))
      }
    </div>
  )
}

export default TechList;