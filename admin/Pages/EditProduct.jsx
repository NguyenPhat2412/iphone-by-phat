import { useEffect, useState } from "react";
import NavBar from "../components/NavBar/navbar";
import "./NewProduct.css";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [short_desc, setShortDesc] = useState("");
  const [long_desc, setLongDesc] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigator = useNavigate();

  const { productId } = useParams(); // Lấy id từ URL

  // Thay đổi image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    } else {
      setImage(null);
    }
  };
  // Lấy thông tin product để edit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/product/product-id/${productId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await res.json();
        if (data) {
          setProductName(data.name || "");
          setCategory(data.category || "");
          setShortDesc(data.short_desc || "");
          setLongDesc(data.long_desc || "");
          setImage(data.image || null);
          setMessage(data.message || "");
          setErrors({});
        } else {
          console.error("No product data found for the given ID");
        }
      } catch (err) {
        console.error("Error when fetch product: ", err);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate inputs
    if (!productName || !category || !short_desc || !long_desc || !image) {
      setErrors({
        productName: !productName ? "Product name is required" : "",
        category: !category ? "Category is required" : "",
        shortDesc: !short_desc ? "Short description is required" : "",
        longDesc: !long_desc ? "Long description is required" : "",
        image: !image ? "Image is required" : "",
      });
      return;
    }
    setErrors({});

    const updatedProduct = {
      name: productName,
      category: category,
      shortDesc: short_desc,
      longDesc: long_desc,
      image: image ? URL.createObjectURL(image) : null, // Chỉ sử dụng URL tạm thời nếu có ảnh
    };

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/product/edit-product/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to add  product");
      }
      alert("Updated product successfully");
      navigator("/");
    } catch (err) {
      console.error("Error when update product", err);
      setMessage("Error when update product: " + err.message);
    }
  };

  return (
    <div className="dashboard-container-main min-h-screen flex bg-white">
      <div className="col-span-1 md:col-span-1">
        <NavBar />
      </div>
      <div
        className="col-span-1 md:col-span-4 p-6 dashboard-container"
        style={{ width: "100%" }}
      >
        <div
          className="transactions bg-white shadow-md rounded-lg p-7 shadow-md mt-6"
          style={{ width: "100%", height: "65vh" }}
        >
          <h2 className="text-2xl font-bold text-left mt-4 mb-6">
            Edit Product
          </h2>
          {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter Product Name"
              ></input>
              {errors.productName && (
                <p className="text-red-500 text-sm">{errors.productName}</p>
              )}
            </div>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter Category"
            ></input>
            <textarea
              type="text"
              value={short_desc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Enter Short Description"
            ></textarea>
            <textarea
              type="text"
              value={long_desc}
              onChange={(e) => setLongDesc(e.target.value)}
              placeholder="Enter Long Description"
            ></textarea>
            <div className="flex flex-col gap-2">
              <p>Upload image (5 images)</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 text-left rounded"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                left: "0",
                width: "fit-content",
              }}
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
