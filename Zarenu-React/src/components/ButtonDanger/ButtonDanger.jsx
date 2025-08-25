/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const ButtonDanger = ({
  label = "Button",
  hasIconEnd = false,
  hasIconStart = false,
  variant,
  disabled = false,
  size,
  className,
  divClassName,
}) => {
  return (
    <button
      className={`button-danger ${variant} disabled-${disabled} ${className}`}
    >
      <div className={`button ${divClassName}`}>{label}</div>
    </button>
  );
};

ButtonDanger.propTypes = {
  label: PropTypes.string,
  hasIconEnd: PropTypes.bool,
  hasIconStart: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "subtle"]),
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["medium", "small"]),
};
