import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const NavBarHome = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userId = user._id || user.id;
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/client/user/logout", {
        method: "GET",
        credentials: "include",
      });
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      Cookies.remove("token", { path: "/" });
      Cookies.remove("token");
      alert("Đăng xuất thành công!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="navbar px-4 py-6 bg-white shadow">
      <div
        className="flex justify-between items-center w-full"
        style={{ margin: "0 auto", maxWidth: "1080px" }}
      >
        {/* Left: Nav Links */}
        <div className="flex space-x-6">
          <Link to="/" className="font-bold text-yellow-500 pr-2">
            Home
          </Link>
          <Link to="/shop">Shop</Link>
        </div>

        {/* Center: Logo */}
        <div className="text-3xl font-semibold text-gray-700">BOUTIQUE</div>

        {/* Right: User + Cart */}
        <div className="flex items-center gap-6 relative">
          <Link to="/cart" className="flex items-center gap-1">
            <i className="fa-solid fa-cart-flatbed"></i> Cart
          </Link>

          {!currentUser ? (
            <Link to="/login" className="flex items-center gap-1">
              <i className="fa-solid fa-user"></i> Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1"
              >
                <i className="fa-solid fa-user"></i> {currentUser.name}
                <i className="fa-solid fa-sort-down ml-1"></i>
              </button>

              {open && (
                <ul className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48 z-50">
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/profile" className="flex gap-2 items-center">
                      <i className="fa-solid fa-user"></i> Profile
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link
                      to={`/order/${userId}`}
                      className="flex gap-2 items-center"
                    >
                      <i className="fa-solid fa-box"></i> Orders
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link
                      to="/change-password"
                      className="flex gap-2 items-center"
                    >
                      <i className="fa-solid fa-key"></i> Change Password
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/wishlist" className="flex gap-2 items-center">
                      <i className="fa-solid fa-heart"></i> Wishlist
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/checkout" className="flex gap-2 items-center">
                      <i className="fa-solid fa-credit-card"></i> Checkout
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex gap-2 items-center w-full"
                    >
                      <i className="fa-solid fa-sign-out-alt"></i> Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBarHome;
