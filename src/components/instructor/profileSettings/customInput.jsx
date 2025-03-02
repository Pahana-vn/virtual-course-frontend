import React from "react";
import PropTypes from "prop-types";

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <button
    className="form-control text-start bg-white"
    onClick={onClick}
    ref={ref}
  >
    {value || "Select Year"}
  </button>
));
export default CustomInput;

CustomInput.displayName = "CustomInput";
CustomInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
