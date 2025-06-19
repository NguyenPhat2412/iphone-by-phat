import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ViewOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [viewOrder, setViewOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/client/order/view-orders/${orderId}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setViewOrder(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Đang tải dữ liệu đơn hàng...
      </p>
    );
  }

  if (!viewOrder) {
    return (
      <p className="text-center text-red-500 mt-10">Không tìm thấy đơn hàng.</p>
    );
  }

  return (
    <div
      className="py-5"
      style={{
        maxWidth: "1080px",
        margin: "0 auto",
      }}
    >
      <h1 className="text-3xl">Information Order</h1>
      <div>
        <div>
          <p className="mb-3">
            <span className="font-medium">ID User:</span> {viewOrder.userId}
          </p>
          <p className="mb-3">
            <span className="font-medium">Full Name:</span>{" "}
            {viewOrder.customer.name}
          </p>

          <p className="mb-3">
            <span className="font-medium">Phone:</span>{" "}
            {viewOrder.customer.phone}
          </p>
          <p className="mb-3">
            <span className="font-medium">Address:</span>{" "}
            {viewOrder.customer.address}
          </p>
          <p className="mb-3">
            <span className="font-medium">Tổng tiền:</span>{" "}
            {viewOrder.totalPrice?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <div>
            <h3 className="text-lg font-semibold pt-6 pb-2 uppercase">
              Product List
            </h3>
          </div>
          <table>
            <thead>
              <tr className="uppercase bg-gray-100 text-gray-600">
                <th className="px-4 py-2">Id product</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {viewOrder.cart && viewOrder.cart.length > 0 ? (
                viewOrder.cart.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{item.productId}</td>
                    <td className="px-4 py-2">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">
                      {item.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-4 py-2">{item.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center">
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* <ul className="list-disc pl-5 text-gray-700">
            {viewOrder.cart && viewOrder.cart.length > 0 ? (
              viewOrder.cart.map((item) => (
                <li key={item._id} className="mb-1">
                  {item.name} -{" "}
                  {item.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                  x {item.quantity}
                </li>
              ))
            ) : (
              <li>Không có sản phẩm nào.</li>
            )}
          </ul> */}

          <button
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate("/orders")}
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
