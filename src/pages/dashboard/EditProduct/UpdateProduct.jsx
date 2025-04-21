import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../redux/features/products/productsApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../../utils/baseURL";
import "../../../Styles/StylesUpdateProduct.css"
import "../../../Styles/StylesUpdateProduct.css"

const UpdateProduct = () => {
  const { id } = useParams();
  const { data: productData, isLoading, isError, refetch } = useGetProductByIdQuery(id);
  const { register, handleSubmit, setValue } = useForm();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [colors, setColors] = useState([]);

  useEffect(() => {
    if (productData) {
      setValue("title", productData.title);
      setValue("description", productData.description);
      setValue("category", productData.category);
      setValue("trending", productData.trending);
      setValue("oldPrice", productData.oldPrice);
      setValue("newPrice", productData.newPrice);
      setValue("stockQuantity", productData.stockQuantity);

      let coverImageUrl = productData.coverImage || "";
      if (coverImageUrl) {
        setPreviewURL(
          coverImageUrl.startsWith("http")
            ? coverImageUrl
            : `${getBaseUrl()}${coverImageUrl}`
        );
      }

      if (Array.isArray(productData.colors)) {
        const formattedColors = productData.colors.map((color) => ({
          colorName:
            typeof color.colorName === "object"
              ? color.colorName.en
              : color.colorName || "",
          image: color.image || "",
          stock: color.stock || 0,
          imageFile: null,
          previewURL:
            color.image && color.image.startsWith("http")
              ? color.image
              : `${getBaseUrl()}${color.image}`,
        }));
        setColors(formattedColors);
      }
    }
  }, [productData, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...colors];
    if (field === "imageFile") {
      updatedColors[index][field] = value;
      updatedColors[index].previewURL = URL.createObjectURL(value);
    } else {
      updatedColors[index][field] = value;
    }
    setColors(updatedColors);
  };

  const addColor = () => {
    setColors([
      ...colors,
      { colorName: "", stock: 0, imageFile: null, previewURL: "" },
    ]);
  };

  const deleteColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(`${getBaseUrl()}/api/upload`, formData);
    return res.data.image;
  };

  const onSubmit = async (data) => {
    let coverImage = productData.coverImage || "";
    if (imageFile) {
      coverImage = await uploadImage(imageFile);
    }

    const updatedColors = await Promise.all(
      colors.map(async (color) => {
        let imageUrl = color.image || "";
        if (color.imageFile) {
          imageUrl = await uploadImage(color.imageFile);
        }

        return {
          colorName: color.colorName, // ✅ Send as EN string, let backend translate
          image: imageUrl,
          stock: Number(color.stock) || 0,
        };
      })
    );

    const allowedCategories = ["Men", "Women", "Children"];
    const finalCategory = allowedCategories.includes(data.category)
      ? data.category
      : "Men";

    const updatedProductData = {
      ...data,
      category: finalCategory,
      coverImage,
      colors: updatedColors,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      stockQuantity: updatedColors[0]?.stock || 0, // ✅ Use first color's stock
    };

    try {
      await updateProduct({ id, ...updatedProductData }).unwrap();
      Swal.fire("Succès !", "Produit mis à jour avec succès !", "success");
      refetch();
    } catch (error) {
      Swal.fire("Erreur !", "Échec de la mise à jour du produit.", "error");
    }
  };




if (isLoading) return <Loading />;
if (isError) return <div className="text-center text-red-500">Erreur lors de la récupération des données du produit.</div>;


return (
  <div className="update-product-container">
    <h2 className="update-product-title">Update Product</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="update-product-form">

      <label>Product Name</label>
      <input {...register("title")} required />

      <label>Description</label>
      <textarea {...register("description")} required />

      <label>Category</label>
      <select {...register("category")} required>
        <option value="">Select a Category</option>
        <option value="Men">Men</option>
        <option value="Women">Women</option>
        <option value="Children">Children</option>
      </select>

      <label>Old Price</label>
      <input {...register("oldPrice")} type="number" required />

      <label>New Price</label>
      <input {...register("newPrice")} type="number" required />

      <label>Stock Quantity</label>
      <input {...register("stockQuantity")} type="number" min="0" required />

      <div className="checkbox-wrapper">
        <input type="checkbox" {...register("trending")} />
        Mark as Trending
      </div>

      <label>Main Image</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewURL && (
        <img
          src={previewURL}
          alt="Main Preview"
          className="update-cover-preview"
        />
      )}

      <label>Product Colors</label>
      {colors.map((color, index) => (
        <div key={index} className="color-block">
          <input
            type="text"
            value={color.colorName}
            onChange={(e) =>
              handleColorChange(index, "colorName", e.target.value)
            }
            placeholder="Color Name (EN)"
            required
          />

          <input
            type="number"
            value={color.stock}
            onChange={(e) =>
              handleColorChange(index, "stock", Number(e.target.value))
            }
            placeholder="Stock Quantity"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleColorChange(index, "imageFile", e.target.files[0])
            }
          />

          {color.previewURL && (
            <img
              src={color.previewURL}
              alt="Color Preview"
              className="color-preview"
            />
          )}

          <button
            type="button"
            onClick={() => deleteColor(index)}
            className="btn-delete-color"
          >
            Remove Color
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addColor}
        className="btn-add-color"
      >
        Add Color
      </button>

      <button
        type="submit"
        className="btn-submit"
      >
        {updating ? "Updating..." : "Update Product"}
      </button>
    </form>
  </div>
);

};

export default UpdateProduct;
