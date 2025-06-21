import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import DashBoard from "../components/Dashboard/Dashboard";
import Users from "../Pages/Users";
import Transactions from "../Pages/Transactions";
import Hotels from "../Pages/Hotels";
import RegisterPage from "../Pages/Register/register";
import LoginPage from "../Pages/Login/login";
import NewProduct from "../Pages/NewProduct";
import EditProduct from "../Pages/EditProduct";
import AdminPanel from "../Pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/new_product" element={<NewProduct />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/edit-product/:productId" element={<EditProduct />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
