import { useContext, useEffect } from "react";
import { SearchContext } from "../../Context/Search";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";

const SearchProducts = () => {
  const { search, setSearch, searchResults, setSearchResults } =
    useContext(SearchContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectProduct = (id) => {
    navigate(`/singleproduct/${id}`);
  };

  useEffect(() => {
    // ✅ URL se query lo agar context empty hai (page refresh case)
    const urlQuery = searchParams.get("q") || "";
    const activeQuery = search || urlQuery;

    // ✅ Context sync karo agar URL se aaya
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
    <div className="p-10 pt-24 bg-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">
        Search results for "{displayQuery}"
      </h1>

      {searchResults.length === 0 ? (
        <p className="text-gray-500 text-lg">No products found.</p>
      ) : (
        <div className="grid grid-cols-4 gap-8">
          {searchResults.map((item) => (
            <div
              key={item._id}
              onClick={() => selectProduct(item._id)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
            >
              {/* IMAGE */}
              <img
                src={`http://localhost:5000/product/${item.image?.[0]}`}
                alt={item.title}
                className="w-full h-[60vh] object-cover object-top"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                {/* BRAND */}
                <div className="flex justify-end">
                  <span className="bg-white px-3 py-1 rounded-xl font-semibold">
                    {item.brand?.title || "Brand"}
                  </span>
                </div>

                {/* BOTTOM INFO */}
                <div className="bg-white flex justify-between items-center rounded-2xl p-3">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p>₹ {item.price}</p>
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-2xl">
                    <MdKeyboardArrowRight />
                  </div>
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
