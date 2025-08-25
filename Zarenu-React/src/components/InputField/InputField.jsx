/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const InputField = ({
  hasLabel = true,
  hasError = false,
  label = "Label",
  error = "Error",
  hasDescription = false,
  description = "Description",
  value = "Value",
  state,
  valueType,
  className,
  inputClassName,
  divClassName,
}) => {
  return (
    <div className={`input-field ${className}`}>
      {hasLabel && <div className={`label ${state}`}>{label}</div>}

      <div className={`input state-${state} ${inputClassName}`}>
        <div
          className={`value state-0-${state} value-type-${valueType} ${divClassName}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

InputField.propTypes = {
  hasLabel: PropTypes.bool,
  hasError: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.string,
  hasDescription: PropTypes.bool,
  description: PropTypes.string,
  value: PropTypes.string,
  state: PropTypes.oneOf(["disabled", "error", "default"]),
  valueType: PropTypes.oneOf(["placeholder", "default"]),
};
