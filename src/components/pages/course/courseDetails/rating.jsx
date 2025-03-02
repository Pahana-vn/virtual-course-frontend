import React from "react";
import PropTypes from "prop-types";
const Rating = ({ averageRating }) => {
    const fullStars = Math.floor(averageRating); // Số lượng ngôi sao đầy
    const hasHalfStar = averageRating % 1 !== 0; // Kiểm tra có ngôi sao nửa không
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Số ngôi sao rỗng
  
    return (
      <div className="rating">
        {/* Hiển thị ngôi sao đầy */}
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <i key={`full-${index}`} className="fas fa-star filled me-1" />
          ))}
  
        {/* Hiển thị ngôi sao nửa (nếu có) */}
        {hasHalfStar && <i className="fas fa-star-half-alt filled me-1" />}
  
        {/* Hiển thị ngôi sao rỗng */}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <i key={`empty-${index}`} className="far fa-star me-1" />
          ))}
  
        {/* Hiển thị giá trị trung bình */}
        <span className="d-inline-block average-rating">
          {averageRating.toFixed(1)}
        </span>
      </div>
    );
  };
  
  Rating.propTypes = {
    averageRating: PropTypes.number.isRequired,
  };
  
  export default Rating;