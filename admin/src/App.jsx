import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import ScrollToTop from "./components/ScrolltoTop/ScrolltoTop";
import { AdminAuthProvider } from "./Context/AdminAuth"; // required — Signin.jsx uses this context

import AdminPanel from "./components/AdminPanel/AdminPanel";
import ProductManage from "./components/Management/ProductManage";
import BrandManage from "./components/Management/BrandManage";
import AdminOrders from "./components/AdminOrders/AdminOrders";
import UserManage from "./components/Management/Usermanage";
import UserDetail from "./components/Userdetail/Userdetail";
import Settings from "./components/Setting/Setting";
import UpdateBrand from "./components/Update/UpdateBrand";
import UpdateProduct from "./components/Update/UpdateProduct";
import ProductForm from "./components/Forms/ProductForm";
import BrandForm from "./components/Forms/BrandForm";
import Analytics from "./components/Analytics/Analytics";
import AdminSignin from "./components/Signin/Signin";
import CreateSignin from "./components/Signin/CreateSignin";

import "./index.css";

const AppContent = () => {
  const location = useLocation();

  // Yeh paths pe sidebar nahi aayega
  const noSidebarPaths = ["/signin", "/create"];
  const hideSidebar = noSidebarPaths.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      {!hideSidebar && <Sidebar />}

      <div
        className={hideSidebar ? "flex-1" : "flex-1 h-screen overflow-y-auto"}
      >
        <Routes>
          <Route path="/signin" element={<AdminSignin />} />
          <Route path="/create" element={<CreateSignin />} />

          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/productmanage" element={<ProductManage />} />
          <Route path="/productmanage/productform" element={<ProductForm />} />
          <Route
            path="/productmanage/updateproduct/:id"
            element={<UpdateProduct />}
          />
          <Route path="/brandmanage" element={<BrandManage />} />
          <Route path="/brandmanage/brandform" element={<BrandForm />} />
          <Route
            path="/brandmanage/updatebrand/:id"
            element={<UpdateBrand />}
          />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/users" element={<UserManage />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />

          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </AdminAuthProvider>
  );
};

export default App;
