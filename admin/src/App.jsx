import Sidebar from "./components/Sidebar/Sidebar";
import ProductForm from "./components/Forms/ProductForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel/AdminPanel";

import "./index.css";
import BrandForm from "./components/Forms/BrandForm";
import Analytics from "./components/Analytics/Analytics";
import ProductManage from "./components/Management/ProductManage";
import BrandManage from "./components/Management/BrandManage";

const App = () => {
  return (
    <div className="w-full h-full bg-zinc-900 text-white flex">
      <Router>
        <Sidebar className="fixed" />
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="productmanage" element={<ProductManage />} />
          <Route path="brandmanage" element={<BrandManage />} />

          <Route path="/productmanage/productform" element={<ProductForm />} />
          <Route path="/brandform" element={<BrandForm />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Router>
    </div>
  );
};
export default App;
