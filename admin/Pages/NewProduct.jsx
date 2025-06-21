import { useState } from "react";
import NavBar from "../components/NavBar/navbar";
import "./NewProduct.css";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const [name, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [short_desc, setShortDesc] = useState("");
  const [long_desc, setLongDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    setImage(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !short_desc || !long_desc || !image || !errors) {
      setErrors({
        name: !name ? "Product name is required" : "",
        category: !category ? "Category is required" : "",
        shortDesc: !short_desc ? "Short description is required" : "",
        longDesc: !long_desc ? "Long description is required" : "",
        price: !price ? "Price is required" : "",
        images: !image ? "Image is required" : "",
        errors: "Please fill in all fields",
      });
      return;
    }
    setErrors({});

    try {
      const formData = new FormData();
      for (let i = 0; i < image.length; i++) {
        formData.append("images", image[i]);
      }

      const uploadResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/upload/upload-multiple`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Failed to upload image");
      }
      const imageUrl = uploadData.filePaths;
      console.log("Image uploaded successfully:", imageUrl);
      const response = await fetch(
        "http://localhost:5000/api/admin/product/new-products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            category,
            short_desc,
            long_desc,
            price,
            images: imageUrl,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log("Response data:", data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to create product");
      }
      alert("Product created successfully!");
      setProductName("");
      setCategory("");
      setShortDesc("");
      setLongDesc("");
      setPrice("");
      setImage(null);
      navigate("/");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product: " + error.message);
      setMessage("Error creating product: " + error.message);
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
          style={{ width: "100%", height: "75vh" }}
        >
          <h2 className="text-2xl font-bold text-left mt-4 mb-6">
            Add New Product
          </h2>
          {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter Product Name"
            ></input>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter Category"
            ></input>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter Price"
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
                onChange={handleFileChange}
                className="border border-gray-300 p-2 rounded"
                multiple
              />
            </div>
            <button
              type="submit"
              className="text-white bg-blue-500 hover:bg-blue-600 text-left rounded"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                left: "0",
                width: "fit-content",
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

export default NewProduct;
