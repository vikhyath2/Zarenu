

import PropTypes from "prop-types";
import React from "react";
import { useReducer } from "react";
import { Icon137 } from "../../icons/Icon137";
import { Search } from "../../icons/Search";
import { IconButton } from "../IconButton";
import "./style.css";
import { useNavigate } from "react-router-dom";



export const SearchBar = ({
  show2NdTrailingIcon = false,
  show1StTrailingIcon = true,
  placeholderText = "Hinted search text",
  showLeadingIcon = true,
  stateProp,
  showAvatar,
  className,
  override = <Icon137 className="icon-2" color="#49454F" />,
  trailingElementsClassName,
  iconButtonBuildingBlocksIconIcon = (
    <Search className="icon-2" color="#49454F" />
  ),
}) => {
  const [state, dispatch] = useReducer(reducer, {
    state: stateProp || "enabled",

    showAvatar: showAvatar || false,
  });
  const navigate = useNavigate();

  const sectionMap = {
    education: "/education-u38-youth-empowerment",
    youth: "/education-u38-youth-empowerment",
    health: "/health-u38-medical-outreach",
    medical: "/health-u38-medical-outreach",
    disability: "/disability-inclusion-u38-special-needs",
    special: "/disability-inclusion-u38-special-needs",
    environment: "/environment-u38-agriculture",
    agriculture: "/environment-u38-agriculture",
    infrastructure: "/infrastructure-u38-housing",
    housing: "/infrastructure-u38-housing",
    corporate: "/corporate-volunteering-u38-csr",
    csr: "/corporate-volunteering-u38-csr",
    "pro bono": "/pro-bono-services",
    legal: "/pro-bono-services",
    refugee: "/refugee-u38-crisis-response",
    crisis: "/refugee-u38-crisis-response",
    sponsorship: "/sponsorship-u38-impact-partnerships",
    impact: "/sponsorship-u38-impact-partnerships",
    targeted: "/targeted-volunteer-outreach",
    outreach: "/targeted-volunteer-outreach",
    team: "/team-volunteer-experiences",
    volunteer: "/team-volunteer-experiences",
    business: "/businessu44-tech-u38-media-skills",
    tech: "/businessu44-tech-u38-media-skills",
    media: "/businessu44-tech-u38-media-skills"
  };
  
  
  
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.toLowerCase();
      const match = Object.keys(sectionMap).find(key => query.includes(key));
      if (match) {
        navigate(sectionMap[match]);
      } else {
        alert("No matching page found.");
      }
      e.target.value = "";
    }
  };
  


  return (
    <div className={`search-bar ${className}`}>
      <div className={`div state-${state.state}`}>
        {state.state === "pressed" && (
          <img className="img" alt="Ripple" src="/img/ripple.svg" />
        )}

        {showLeadingIcon && (
          <IconButton
            buildingBlocksIconIcon={
              state.state === "pressed" ? (
                <Icon137 className="icon-2" color="#49454F" />
              ) : undefined
            }
            className={`${state.state === "pressed" && "class-20"}`}
            size="small"
            style="standard"
            type="round"
            width="default"
          />
        )}

        {state.state === "pressed" && (
          <>
            <div className="supporting-text-wrapper">
              <div className="supporting-text">{placeholderText}</div>
            </div>

            <div
              className={`trailing-elements show-avatar-${state.showAvatar}`}
            >
              {show1StTrailingIcon && (
                <IconButton
                  buildingBlocksIconIcon={
                    <Search className="icon-2" color="#49454F" />
                  }
                  size="small"
                  style="standard"
                  type="round"
                  width="default"
                />
              )}

              {state.showAvatar && (
                <div className="avatar-target">
                  <div className="avatar">
                    <div className="initial">A</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {["enabled", "hovered"].includes(state.state) && (
          <>
            <div
              className="supporting-text-wrapper"
              onMouseEnter={() => {
                dispatch("mouse_enter");
              }}
              onMouseLeave={() => {
                dispatch("mouse_leave");
              }}
            >
          <input
  type="text"
  placeholder={placeholderText}
  onKeyPress={handleKeyPress}
  className="supporting-text"
  style={{
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#000",
    width: "100%",
    maxWidth: "300px", // ✅ limit size so it doesn't stretch layout
    fontSize: "14px",   // ✅ match your existing text styling
  }}
/>


            </div>

            <div
              className={`trailing-elements-2 show-avatar-0-${state.showAvatar} ${trailingElementsClassName}`}
            >
              {show1StTrailingIcon && (
                <IconButton
                  buildingBlocksIconIcon={iconButtonBuildingBlocksIconIcon}
                  size="small"
                  style="standard"
                  type="round"
                  width="default"
                />
              )}

              {state.showAvatar && (
                <div className="avatar-target">
                  <div className="avatar">
                    <div className="initial">A</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function reducer(state, action) {
  switch (action) {
    case "mouse_enter":
      return {
        ...state,
        state: "hovered",
      };

    case "mouse_leave":
      return {
        ...state,
        state: "enabled",
      };
  }

  return state;
}

SearchBar.propTypes = {
  show2NdTrailingIcon: PropTypes.bool,
  show1StTrailingIcon: PropTypes.bool,
  placeholderText: PropTypes.string,
  showLeadingIcon: PropTypes.bool,
  stateProp: PropTypes.oneOf(["hovered", "pressed", "enabled"]),
  showAvatar: PropTypes.bool,
};
