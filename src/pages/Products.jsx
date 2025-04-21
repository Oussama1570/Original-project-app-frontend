import React, { useState, useEffect } from "react";
import ProductCard from "../pages/products/ProductCard";
import { useGetAllProductsQuery } from "../redux/features/products/productsApi";
import Selector from "../components/Selector";
import SearchInput from "../components/SearchInput";
import "../Styles/StylesProducts.css";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { productEventsActions } from "../redux/features/products/productEventsSlice";

const categories = ["All", "Men", "Women", "Children"];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadMore, setLoadMore] = useState(8);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: products = [] } = useGetAllProductsQuery();
  const shouldRefetch = useSelector((state) => state.productEvents.shouldRefetch);

  useEffect(() => {
    if (shouldRefetch) {
      dispatch(productEventsActions.resetRefetch());
    }
  }, [shouldRefetch, dispatch]);

  const filteredProducts = products
    .filter((product) => {
      const matchCategory =
        selectedCategory === "All" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .slice(0, loadMore);

  return (
    <div className="products-page">
      <Helmet>
        <title>{t("products_page.title")}</title>
      </Helmet>

      <h2 className="products-title">Products Collections</h2>

      <div className="filters">
        <Selector options={categories} onSelect={setSelectedCategory} />
        <SearchInput
          setSearchTerm={setSearchTerm}
          placeholder={t("search_placeholder")}
        />
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <p className="no-products">{t("no_products_found")}</p>
        )}
      </div>

      {filteredProducts.length < products.length && (
        <div className="load-more-wrapper">
          <button className="load-more-btn" onClick={() => setLoadMore(loadMore + 8)}>
            {t("load_more")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
