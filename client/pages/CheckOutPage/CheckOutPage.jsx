import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CheckOutPage = () => {
  const cart = useSelector((state) => state.cart.listCart);

  // get id user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser ? currentUser.id : null;
  console.log("User ID:", userId);

  const cleanedCart = cart.map((item) => ({
    productId: item._id?.$oid || item._id, //  chuyển về string
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    img: item.img1 || item.img, // tuỳ thuộc vào cấu trúc của bạn
  }));
  const navigate = useNavigate();

  // Tính tổng tiền đơn hàng
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // State lưu thông tin khách
  // hàng
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  });

  // Xử lý khi thay đổi input
  const handleChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    const orderData = {
      userId: userId,
      customer: customerInfo,
      cart: cleanedCart,
      totalPrice: totalPrice,
    };

    // Gửi yêu cầu đặt hàng đến server
    fetch("http://localhost:5000/api/client/order/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
      credentials: "include", // Đảm bảo cookie được gửi đi
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Đặt hàng thành công!");
          console.log("Order placed successfully:", data);
          // Xóa giỏ hàng sau khi đặt hàng thành công
          localStorage.removeItem("cart");
        }
      })
      .catch((err) => {
        console.error("Error placing order:", err);
        alert("Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại sau.");
      });
    // Chuyển hướng về trang chủ sau khi đặt hàng
    navigate("/");
  };

  return (
    <div
      className="container mx-auto py-10 px-5 "
      style={{ maxWidth: "1080px", margin: "0 auto", minHeight: "68vh" }}
    >
      <div className="bg-gray-100 p-20 rounded-lg shadow-md mb-6 flex justify-between ">
        <h1 className="text-3xl font-bold text-center mb-6 ">CHECKOUT</h1>
        <div className="flex flex-row ">
          <h3 className="text-xl font-bold text-black text-center mb-6 px-2 ">
            HOME /
          </h3>
          <h3 className="text-xl font-bold text-black text-center mb-6 pr-2">
            CART /
          </h3>
          <h3 className="text-xl font-bold text-gray-400 text-center mb-6 ">
            CHECKOUT
          </h3>
        </div>
      </div>
      <h1 className="text-3xl  mb-6 py-10">BILLING DETAILS</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 📝 Form nhập thông tin giao hàng */}
        <div className="w-full md:w-2/3 rounded-lg flex flex-col gap-4">
          <label className="mb-2">FULL NAME:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Full Name Here!"
            value={customerInfo.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-3 rounded-md"
          />
          <label className="mb-2">EMAIL:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email Here!"
            value={customerInfo.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-3 rounded-md"
          />
          <label className="mb-2">PHONE NUMBER:</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter Your Phone Number Here!"
            value={customerInfo.phone}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-3 rounded-md"
          />
          <label className="mb-2">ADDRESS:</label>
          <input
            type="text"
            name="address"
            placeholder="Enter Your Address Here!"
            value={customerInfo.address}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-3 rounded-md"
          />

          {/* Chọn phương thức thanh toán
          <div className="mb-3">
            <h3 className="font-semibold">Phương Thức Thanh Toán:</h3>
            <label className="block">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={customerInfo.paymentMethod === "cod"}
                onChange={handleChange}
                className="mr-2"
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label className="block">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={customerInfo.paymentMethod === "bank"}
                onChange={handleChange}
                className="mr-2"
              />
              Chuyển khoản ngân hàng
            </label>
          </div> */}

          <button
            onClick={handlePlaceOrder}
            className="bg-gray-900 text-white px-5 w-fit py-2 rounded-md text-lg"
          >
            Place order
          </button>
        </div>

        {/* 🛍️ Danh sách sản phẩm trong giỏ hàng */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">YOUR ORDERS</h2>
          <ul className="divide-y divide-gray-300">
            {cart.map((item) => (
              <li key={item._id["$oid"]} className="py-3 flex justify-between">
                <div className="flex">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {item.price.toLocaleString()} VND
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
            <span>TOTAL</span>
            <span>{totalPrice.toLocaleString()} VND</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;
