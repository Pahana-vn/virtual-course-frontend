import React from "react";
import PropTypes from "prop-types";
import "./popup.css"
const Popup = ({ isOpen, title, onClose, children = null }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h4>{title}</h4>
        <div className="popup-body">{children}</div>
        <div className="popup-actions">
          <button className="btn btn-danger" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
    
  );
};
Popup.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Bắt buộc và kiểu boolean
    title: PropTypes.string.isRequired, // Bắt buộc và kiểu string
    onClose: PropTypes.func.isRequired, // Bắt buộc và kiểu function
    onSubmit: PropTypes.func.isRequired, // Bắt buộc và kiểu function
    children: PropTypes.node, // Không bắt buộc, kiểu ReactNode
  };
  

export default Popup;
