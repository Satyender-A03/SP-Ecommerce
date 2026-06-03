import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import "./index.css";
import SingleProduct from "./components/SingleProduct/SingleProduct";
import Products from "./pages/Products";
import SearchProducts from "./components/SearchProduct/SearchProduct";
import { SearchProvider } from "./Context/Search";
import { CartProvider } from "./Context/Cart";
import { AuthProvider } from "./Context/Auth"; // 🔥 ADD
import AddtoCart from "./components/AddToCart/AddToCart";
import Checkout from "./components/CheckOut/CheckOut";
import Signin from "./components/Signin/Signin";
import CreateSignin from "./components/Signin/CreateSignin";
import Profile from "./components/UserProfile/UserProfile"; // 🔥 ADD
import OrderPage from "./components/OrderPage/OrderPage";

const App = () => {
  return (
    <div className="w-full h-screen">
      <AuthProvider>
        <SearchProvider>
          <CartProvider>
            <Router>
              <Navbar />

              <Routes>
                <Route path="/signin" element={<Signin />} />
                <Route path="/create" element={<CreateSignin />} />

                <Route path="/order" element={<OrderPage />} />
                <Route path="/" element={<Homepage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/singleproduct/:id" element={<SingleProduct />} />
                <Route path="/addtocart" element={<AddtoCart />} />
                <Route path="/searchproduct" element={<SearchProducts />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Router>
          </CartProvider>
        </SearchProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
