import { useEffect } from "react";
import { useState } from "react";

const HistoryOrder = () => {
  const [orders, setOrders] = useState([]);
  // order with id user
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser ? currentUser.id : null;
  console.log("User ID:", userId);

  // Fetch orders from the server
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/client/order/${userId}`,
          {
            credentials: "include", // Ensure cookies are sent
          }
        );
        const data = await response.json();
        console.log("Fetched orders:", data);
        if (data.error) {
          console.error("Error fetching orders:", data.error);
        } else {
          setOrders(data || []);
          console.log("Orders set:", data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [userId]);

  // Check if userId is null or undefined
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-120 p-10 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center py-12 mb-4">
            HISTORY ORDER
          </h1>
          <p className="text-center text-gray-500">
            Please log in to view your orders.
          </p>
          <div className="text-center mt-6">
            <a href="/login" className="text-blue-500 hover:underline">
              Go to login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-165">
      <div className="p-10">
        <div
          className="bg-gray-100 p-20 rounded-lg shadow-md mb-6 flex justify-between "
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            transform: "translateY(-180px)",
          }}
        >
          <h1 className="text-3xl font-bold text-center mb-6 ">History</h1>
          <h3 className="text-xl font-bold text-gray-400 text-center mb-6 ">
            History
          </h3>
        </div>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div
            style={{
              maxWidth: "1080px",
              transform: "translateY(0px)",
              marginTop: "-150px",
            }}
          >
            <div className="text-center">
              <p className="text-black pb-4 uppercase">
                You have <strong>{orders.length}</strong> order(s).
              </p>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className=" px-2 py-2">ID ORDER</th>
                  <th className=" px-2 py-2">ID USER</th>
                  <th className=" px-2 py-2">NAME</th>
                  <th className=" px-2 py-2">PHONE</th>
                  <th className=" px-2 py-2">ADDRESS</th>
                  <th className=" px-2 py-2">TOTAL</th>
                  <th className=" px-2 py-2">DELIVERY</th>
                  <th className=" px-2 py-2">STATUS</th>
                  <th className=" px-2 py-2">DETAIL</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">{order._id}</td>
                    <td className="px-2 py-2">{order.userId}</td>
                    <td className="px-2 py-2">{order.customer.name}</td>
                    <td className="px-2 py-2">{order.customer.phone}</td>
                    <td className="px-2 py-2">{order.customer.address}</td>
                    <td className=" px-2 py-2">${order.totalPrice}</td>
                    <td className=" px-2 py-2">
                      {order.delivery ? "Yes" : "No"}
                    </td>
                    <td className=" px-2 py-2">{order.status}</td>
                    <td className=" px-2 py-2">
                      <a
                        href={`/order/view-orders/${order._id}`}
                        className="text-blue-500 hover:underline border border-blue-500 px-2 py-1"
                      >
                        View <i className="fa-solid fa-arrow-right"></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div
          className="text-center"
          style={{ marginTop: "20px", transform: "translateY(0px)" }}
        >
          <a
            href="/"
            className="text-blue-500 hover:underline block w-40 text-center p-2 bg-gray-100 rounded-lg shadow-md mx-auto"
          >
            Go back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default HistoryOrder;
