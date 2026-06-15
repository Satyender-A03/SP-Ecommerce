import { useContext, useEffect } from "react";
import { SearchContext } from "../../Context/Search";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";

const SearchProducts = () => {
  const { search, setSearch, searchResults, setSearchResults } =
    useContext(SearchContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    const activeQuery = search || urlQuery;

    if (!search && urlQuery) {
      setSearch(urlQuery);
    }

    if (!activeQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products/");
        const data = await res.json();

        const query = activeQuery.toLowerCase();

        const filtered = data.filter((item) => {
          const title = item.title?.toLowerCase() || "";
          const name = item.name?.toLowerCase() || "";
          return title.includes(query) || name.includes(query);
        });

        setSearchResults(filtered);
      } catch (err) {
        console.error("Fetch error:", err);
        setSearchResults([]);
      }
    };

    fetchProducts();
  }, [search, searchParams]);

  const displayQuery = search || searchParams.get("q") || "";

  return (
    <div className="w-full min-h-screen bg-[#e8e8e8] px-6 md:px-10 pt-22 pb-10">
      {/* HEADING */}
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">
        Search results for "{displayQuery}"
      </h2>

      {searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-xl font-bold text-gray-600">No Products Found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/singleproduct/${item._id}`)}
              className="bg-white rounded-2xl overflow-hidden cursor-pointer group relative shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Brand badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                  {item.brand?.title || "Brand"}
                </span>
              </div>

              {/* Image */}
              <div className="h-[50vh] overflow-hidden">
                <img
                  src={`http://localhost:5000/product/${item.image?.[0]}`}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
                />
              </div>

              {/* Bottom info */}
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-bold text-gray-900 text-[15px]">
                    {item.title}
                  </p>
                  <p className="text-gray-600 text-sm mt-0.5">₹ {item.price}</p>
                </div>
                <div className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-xl group-hover:bg-black group-hover:text-white transition duration-300 flex-shrink-0">
                  <MdKeyboardArrowRight />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;
