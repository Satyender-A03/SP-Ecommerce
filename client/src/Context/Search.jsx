import { createContext, useState } from "react";

export const SearchContext = createContext({
  search: "",
  setSearch: () => {},
  searchResults: [],
  setSearchResults: () => {},
});

export const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  return (
    <SearchContext.Provider
      value={{ search, setSearch, searchResults, setSearchResults }}
    >
      {children}
    </SearchContext.Provider>
  );
};
