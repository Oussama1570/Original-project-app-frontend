import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "../products/ProductCard";
import { useGetAllProductsQuery } from "../../redux/features/products/productsApi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../../Styles/StylesOurSellers.css";

const categories = ["All", "Men", "Women", "Children"];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1400 }, items: 3 },
  desktop: { breakpoint: { max: 1400, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const CustomLeftArrow = ({ onClick }) => (
  <button className="custom-arrow left" onClick={onClick}>
    <FiChevronLeft size={20} />
  </button>
);

const CustomRightArrow = ({ onClick }) => (
  <button className="custom-arrow right" onClick={onClick}>
    <FiChevronRight size={20} />
  </button>
);

const OurSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: products = [] } = useGetAllProductsQuery();

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="our-sellers">
      <h2 className="our-sellers-title">Our Collection</h2>

      <div className="category-selector">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="carousel-wrapper">
        <Carousel
          responsive={responsive}
          infinite
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          itemClass="carousel-item-padding"
          containerClass="carousel-container"
        >
          {filteredProducts.map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default OurSellers;
