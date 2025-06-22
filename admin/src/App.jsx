import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import DashBoard from "../components/Dashboard/Dashboard";
import Users from "../Pages/Users";
import SignUpPage from "../Pages/Register/RegisterPage";
import LoginPage from "../Pages/Login/Login";
import NewProduct from "../Pages/NewProduct";
import EditProduct from "../Pages/EditProduct";
import AdminPanel from "../Pages/Admin";
import Product from "../Pages/Product/Product";
import ViewOrder from "../Pages/ViewOrder/ViewOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/new_product" element={<NewProduct />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/edit-product/:productId" element={<EditProduct />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/products" element={<Product />} />
        <Route path="/orders/:orderId" element={<ViewOrder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
