import { SearchBar } from ".";

export default {
  title: "Components/SearchBar",
  component: SearchBar,

  argTypes: {
    stateProp: {
      options: ["hovered", "pressed", "enabled"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    show2NdTrailingIcon: false,
    show1StTrailingIcon: true,
    placeholderText: "Hinted search text",
    showLeadingIcon: true,
    stateProp: "hovered",
    showAvatar: true,
    className: {},
    trailingElementsClassName: {},
  },
};
