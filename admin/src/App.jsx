import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import DashBoard from "../components/Dashboard/Dashboard";
import Rooms from "../Pages/Rooms";
import Users from "../Pages/Users";
import Transactions from "../Pages/Transactions";
import Hotels from "../Pages/Hotels";
import NewRoom from "../Pages/NewRoom";
import RegisterPage from "../Pages/Register/register";
import LoginPage from "../Pages/Login/login";
import EditHotel from "../Pages/EditHotel";
import EditRoom from "../Pages/EditRoom";
import NewProduct from "../Pages/NewProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/users" element={<Users />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/new_product" element={<NewProduct />} />
        <Route path="/new_room" element={<NewRoom />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/edit-hotel/:hotelId" element={<EditHotel />} />
        <Route path="/edit-room/:roomId" element={<EditRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
