import { useEffect, useState } from "react";
import NavBar from "../NavBar/navbar";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const DashBoard = () => {
  const [numberClient, setNumberClient] = useState(0);
  const [numberOrder, setNumberOrder] = useState(0);
  const [numberEarning, setNumberEarning] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ProductPerPage = 8;

  const API_URL = import.meta.env.VITE_API_URL;

  // Lấy thông tin tổng quan
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clientRes, orderRes, earningRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/user/number-client`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${API_URL}/api/admin/user/number-order`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${API_URL}/api/admin/user/number-earning`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${API_URL}/api/admin/user/orders`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        const [clientData, orderData, earningData, ordersData] =
          await Promise.all([
            clientRes.json(),
            orderRes.json(),
            earningRes.json(),
            ordersRes.json(),
          ]);

        setNumberClient(clientData.numberClient);

        setNumberOrder(orderData.numberOrder);
        console.log("Number of Orders:", orderData.numberOrder);
        setNumberEarning(earningData.numberEarning);
        console.log("Number of Earnings:", earningData.numberEarning);
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // // Phân trang
  // const indexOfLastProduct = currentPage * ProductPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - ProductPerPage;
  // const currentProducts = products.slice(
  //   indexOfFirstProduct,
  //   indexOfLastProduct
  // );
  // const totalPages = Math.ceil(products.length / ProductPerPage);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // const paginateRange = 1;
  // const startPage = Math.max(1, currentPage - Math.floor(paginateRange / 2));
  // const endPage = Math.min(totalPages, startPage + paginateRange - 1);
  return (
    <div className="dashboard-container-main min-h-screen flex bg-white ">
      <div className="col-span-1 md:col-span-1">
        <NavBar />
      </div>

      <div
        className="col-span-1 md:col-span-4 p-6 dashboard-container"
        style={{ width: "100%" }}
      >
        <div
          className="transactions bg-white shadow-md rounded-lg p-7 shadow-md mt-6"
          style={{ width: "100%", height: "75vh" }}
        >
          <div className="dashboard-header mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="dashboard-stats grid grid-cols-3 gap-20 mt-4 ">
              <div className="stat-item bg-gray-100 p-4 rounded shadow">
                <div>
                  <p className="text-2xl font-bold">{numberClient}</p>
                  <h2 className="text-xl font-semibold">Clients</h2>
                </div>
                <div>
                  <i className="fa-solid fa-user-plus"></i>
                </div>
              </div>
              <div className="stat-item bg-gray-100 p-4 rounded shadow">
                <div>
                  <p className="text-2xl font-bold">{numberEarning} VND</p>
                  <h2 className="text-xl font-semibold">Earnings of Month</h2>
                </div>
                <div>
                  <i className="fa-solid fa-dollar-sign"></i>
                </div>
              </div>
              <div className="stat-item bg-gray-100 p-4 rounded shadow">
                <div>
                  <p className="text-2xl font-bold">{numberOrder}</p>

                  <h2 className="text-xl font-semibold">New Orders</h2>
                </div>
                <div>
                  <i className="fa-solid fa-file-circle-plus"></i>
                </div>
              </div>
            </div>
          </div>
          <div>
            {loading ? (
              <p>Loading</p>
            ) : orders.length === 0 ? (
              <div>No Order</div>
            ) : (
              <div>
                {orders.map((order) => (
                  <div key={order._id} className="order-item ">
                    <table className="table-content w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="font-bold">ID User</th>
                          <th className="font-bold">Name</th>
                          <th className="font-bold">Phone</th>
                          <th className="font-bold">Address</th>
                          <th className="font-bold">Total</th>
                          <th className="font-bold">Delivery</th>
                          <th className="font-bold">Status</th>
                          <th className="font-bold">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50 text-center">
                          <td>{order.userId}</td>
                          <td>{order.customer.name}</td>
                          <td>{order.customer.phone}</td>
                          <td>{order.customer.address}</td>
                          <td>{order.totalPrice} VND</td>
                          <td>
                            {order.delivery
                              ? "Đã hoàn thành"
                              : "Chưa hoàn thành"}
                          </td>
                          <td>{order.status}</td>
                          <td>
                            <Link
                              to={`/orders/${order._id}`}
                              className="text-blue-500 hover:underline border border-blue-500"
                              style={{
                                padding: "5px 10px",
                                borderRadius: "5px",
                                backgroundColor: "#f0f0f0",
                              }}
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
