import { useState } from "react";
import { setCategory } from "../store/techStore";

type Props = {
  categories: string[]
}

const FilterButton = function({categories}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('All');
  const allCategories  = ['All', ...categories];

  const handleSelect = (filter:string) => {
    setActive(filter);
    setIsOpen(false);
    setCategory(filter);
  }

  return (
    <div className="flex items-center gap-2 p-4 bg-white">
      <div className={`flex items-center rounded-2xl overflow-hidden transition-all duration-500 ease-in-out
        ${isOpen ? 'max-w-[600px] shadow-md' : 'max-w-[120px]'}
        `}>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-2xl
              ${isOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'}
              `}
            >
              <span className="flex items-center gap-1">
                {active}
              </span>
          </button>

          <div className={`flex items-center pr-2 transition-opacity duration-300
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}>
              {
                allCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleSelect(c)}
                    className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap hover:bg-blue-50 rounded-full transition-all">
                      {c}
                  </button> 
                ))
              }
          </div>
      </div>
    </div>
  )
}

export default FilterButton;