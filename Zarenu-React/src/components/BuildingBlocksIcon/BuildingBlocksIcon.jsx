/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { useReducer } from "react";
import { Icon18 } from "../../icons/Icon18";
import "./style.css";

export const BuildingBlocksIcon = ({
  stateProp,
  className,
  stateLayerClassName,
  icon = <Icon18 className="icon" color="#49454F" />,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    state: stateProp || "enabled",
  });

  return (
    <div
      className={`building-blocks-icon ${state.state} ${className}`}
      onMouseLeave={() => {
        dispatch("mouse_leave");
      }}
      onMouseEnter={() => {
        dispatch("mouse_enter");
      }}
    >
      <div className={`state-layer ${stateLayerClassName}`}>
        {["disabled", "enabled", "focused", "hovered"].includes(
          state.state,
        ) && <>{icon}</>}

        {state.state === "pressed" && (
          <>
            <img className="ripple" alt="Ripple" src="/img/ripple-2.svg" />

            <Icon18 className="icon" color="#49454F" />
          </>
        )}
      </div>
    </div>
  );
};

function reducer(state, action) {
  if (state.state === "enabled") {
    switch (action) {
      case "mouse_enter":
        return {
          state: "hovered",
        };
    }
  }

  switch (action) {
    case "mouse_leave":
      return {
        ...state,
        state: "enabled",
      };
  }

  return state;
}

BuildingBlocksIcon.propTypes = {
  stateProp: PropTypes.oneOf([
    "enabled",
    "focused",
    "pressed",
    "hovered",
    "disabled",
  ]),
};
