import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../../services/categoryService";

const TopCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data); // Lưu danh sách categories vào state
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  var settings = {
    items: 2,
    margin: 25,
    dots: true,
    nav: true,
    navText: [
      '<i className="fas fa-arrow-left"></i>',
      '<i className="fas fa-arrow-right"></i>',
    ],
    loop: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        margin: 25,
      },
      768: {
        items: 3,
        margin: 25,
      },
      1170: {
        items: 4,
        margin: 25,
      },
    },
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <section className="section how-it-works">
      <div className="container">
        <div className="section-header aos" data-aos="fade-up">
          <div className="section-sub-head">
            <span>Favourite Course</span>
            <h2>Top Category</h2>
          </div>
          <div className="all-btn all-category d-flex align-items-center">
            <Link to="/job-category" className="btn btn-primary">
              All Categories
            </Link>
          </div>
        </div>
        <div className="section-text aos" data-aos="fade-up">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget aenean
            accumsan bibendum gravida maecenas augue elementum et neque.
            Suspendisse imperdiet.
          </p>
        </div>
        <OwlCarousel
          {...settings}
          className="owl-carousel mentoring-course owl-theme aos"
          data-aos="fade-up"
          loop
          margin={10}
          nav
        >
          {categories.map((category) => (
            <div className="feature-box text-center" key={category.id}>
              <div className="feature-bg">
                <div className="feature-header">
                  <div className="feature-icon">
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{ width: "100px", height: "100px" }} // Thêm style tùy chỉnh
                    />
                  </div>
                  <div className="feature-cont">
                    <div className="feature-text">{category.name}</div>
                  </div>
                </div>
                <p>{category.description}</p>
              </div>
            </div>
          ))}
        </OwlCarousel>
      </div>
    </section>
  );
};

export default TopCategory;
