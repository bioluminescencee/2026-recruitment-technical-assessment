import { FilterIcon, SearchIcon, SortIcon } from "../Icons";
import "./Searchbar.css";

export function SearchBar() {
    return (
        <div className="searchbar">
            <button><FilterIcon size="24px" fill="currentColor" />Filters</button>
            <div className="search">
                <SearchIcon size="1.5rem" fill="var(--text-gray)" />
                <input className="search-input" type="text" placeholder="Search for a building..." />
            </div>
            <button><SortIcon size="24px" fill="currentColor" />Sort</button>
        </div>
    )
}