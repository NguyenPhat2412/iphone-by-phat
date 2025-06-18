import { useState } from "react";
// import banner from "../../img/banner1.jpg";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Validate
  const validate = () => {
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return false;
    }
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự!");
      return false;
    }
    setError("");
    return true;
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const userData = {
      email,
      password,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/client/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include", // Đảm bảo cookie được gửi đi
        }
      );
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        alert("Đăng nhập thành công!");
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="container-login">
      <div className="flex items-center justify-center min-h-165">
        <div className="w-120 px-10 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center py-20">Sign In</h1>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-5 border border-gray-300 rounded mb-3"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-5 border border-gray-300 rounded mb-3"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-3 mt-3">{error}</p>}
          <button
            className="w-full bg-gray-800 text-white p-5 rounded hover:bg-green-600 mt-4"
            style={{ marginTop: "20px" }}
            onClick={handleLogin}
          >
            SIGN IN
          </button>
          <div
            className="text-center mt-3 text-gray-300"
            style={{ marginTop: "50px", marginBottom: "50px" }}
          >
            Create an account?
            <Link to="/register" style={{ color: "#00CCCC" }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
