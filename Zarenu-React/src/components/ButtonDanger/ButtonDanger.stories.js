import { ButtonDanger } from ".";

export default {
  title: "Components/ButtonDanger",
  component: ButtonDanger,

  argTypes: {
    variant: {
      options: ["primary", "subtle"],
      control: { type: "select" },
    },
    size: {
      options: ["medium", "small"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    label: "Button",
    hasIconEnd: false,
    hasIconStart: false,
    variant: "primary",
    disabled: false,
    size: "medium",
    className: {},
    divClassName: {},
  },
};
