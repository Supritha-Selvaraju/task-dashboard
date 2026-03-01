import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Filter } from "lucide-react";

interface Props {
  onSearch: (value: string) => void;
  onSort: (value: "priority" | "status") => void;
  onFilter: (filters: string[]) => void;
}

export default function TaskControls({
  onSearch,
  onSort,
  onFilter,
}: Props) {
  const [openMenu, setOpenMenu] = useState<
    null | "search" | "sort" | "filter"
  >(null);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = (value: string) => {
    let updated;

    if (selectedFilters.includes(value)) {
      updated = selectedFilters.filter((f) => f !== value);
    } else {
      updated = [...selectedFilters, value];
    }

    setSelectedFilters(updated);
    onFilter(updated);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-4"
    >
      {/* SEARCH */}
      <button
        onClick={() =>
          setOpenMenu(openMenu === "search" ? null : "search")
        }
        className="hover:text-black text-gray-600"
      >
        <Search size={18} />
      </button>

      {openMenu === "search" && (
        <div className="absolute top-10 right-0 bg-white shadow-lg rounded-xl p-3 z-50 w-56">
          <input
            autoFocus
            placeholder="Search tasks..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none"
          />
        </div>
      )}

      {/* SORT */}
      <button
        onClick={() =>
          setOpenMenu(openMenu === "sort" ? null : "sort")
        }
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-black"
      >
        Sort By <ChevronDown size={16} />
      </button>

      {openMenu === "sort" && (
        <div className="absolute top-10 right-0 bg-white shadow-lg rounded-xl p-2 text-sm z-50 w-40">
          <div
            onClick={() => {
              onSort("priority");
              setOpenMenu(null);
            }}
            className="hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer"
          >
            Priority
          </div>
          <div
            onClick={() => {
              onSort("status");
              setOpenMenu(null);
            }}
            className="hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer"
          >
            Status
          </div>
        </div>
      )}

      {/* FILTER */}
      <button
        onClick={() =>
          setOpenMenu(openMenu === "filter" ? null : "filter")
        }
        className="hover:text-black text-gray-600"
      >
        <Filter size={18} />
      </button>

      {openMenu === "filter" && (
        <div className="absolute top-10 right-0 bg-white shadow-lg rounded-xl p-4 text-sm z-50 w-48 space-y-2">
          {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedFilters.includes(status)}
                onChange={() => toggleFilter(status)}
              />
              {status.replace("_", " ")}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}