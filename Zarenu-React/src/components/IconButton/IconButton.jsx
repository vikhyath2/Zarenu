/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Icon18 } from "../../icons/Icon18";
import { BuildingBlocksIcon } from "../BuildingBlocksIcon";
import "./style.css";

export const IconButton = ({
  type,
  size,
  style,
  width,
  buildingBlocksIconIcon = <Icon18 className="icon-18" color="#49454F" />,
  className,
}) => {
  return (
    <div className={`icon-button ${size} width-${width} ${className}`}>
      {((size === "large" && style === "standard") ||
        (size === "medium" && style === "standard") ||
        (size === "x-large" && style === "standard") ||
        (size === "x-small" && style === "standard") ||
        style === "filled" ||
        style === "outline" ||
        style === "tonal") && (
        <div
          className={`content ${type} ${style} width-0-${width} size-${size}`}
        >
          <div className="icon-wrapper">
            <Icon18
              className={`${(size === "x-large" && style === "filled" && width === "narrow") || (size === "x-large" && style === "outline" && width === "narrow") || (size === "x-large" && style === "standard" && width === "narrow") || (size === "x-large" && width === "default") || (size === "x-large" && width === "wide") ? "class" : ((size === "large" && style === "filled" && width === "narrow") || (size === "large" && style === "outline" && width === "narrow") || (size === "large" && style === "standard" && width === "narrow") || (size === "large" && width === "default") || (size === "large" && width === "wide")) ? "class-2" : (size === "medium" && style === "filled" && width === "wide") || (size === "medium" && style === "outline" && width === "wide") || (size === "medium" && style === "standard" && width === "wide") ? "class-3" : size === "x-small" && ["filled", "outline", "standard"].includes(style) ? "class-4" : width === "narrow" && size === "x-large" && style === "tonal" ? "class-5" : size === "large" && width === "narrow" && style === "tonal" ? "class-6" : width === "narrow" && size === "medium" && style === "tonal" ? "class-7" : size === "small" && width === "wide" && style === "tonal" ? "class-8" : width === "default" && size === "small" && style === "tonal" ? "class-9" : width === "narrow" && size === "small" && style === "tonal" ? "class-10" : size === "x-small" && width === "wide" && style === "tonal" ? "class-11" : size === "x-small" && width === "default" && style === "tonal" ? "class-12" : size === "x-small" && width === "narrow" && style === "tonal" ? "class-13" : "icon-18"}`}
              color={
                style === "tonal"
                  ? "#4A4459"
                  : style === "filled"
                    ? "white"
                    : "#49454F"
              }
            />
          </div>
        </div>
      )}

      {size === "small" && style === "standard" && (
        <BuildingBlocksIcon
          className={`${width === "default" && type === "square" ? "class-14" : (width === "narrow" && type === "square") ? "class-15" : width === "wide" && type === "round" ? "class-16" : width === "default" && type === "round" ? "class-17" : width === "narrow" && type === "round" ? "class-18" : "class-19"}`}
          icon={buildingBlocksIconIcon}
          stateLayerClassName="building-blocks-icon-button-small-standard"
          stateProp="enabled"
        />
      )}
    </div>
  );
};

IconButton.propTypes = {
  type: PropTypes.oneOf(["round", "square"]),
  size: PropTypes.oneOf(["large", "x-small", "small", "x-large", "medium"]),
  style: PropTypes.oneOf(["filled", "tonal", "outline", "standard"]),
  width: PropTypes.oneOf(["default", "narrow", "wide"]),
};
