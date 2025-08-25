import { IconButton } from ".";

export default {
  title: "Components/IconButton",
  component: IconButton,

  argTypes: {
    type: {
      options: ["round", "square"],
      control: { type: "select" },
    },
    size: {
      options: ["large", "x-small", "small", "x-large", "medium"],
      control: { type: "select" },
    },
    style: {
      options: ["filled", "tonal", "outline", "standard"],
      control: { type: "select" },
    },
    width: {
      options: ["default", "narrow", "wide"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    type: "round",
    size: "large",
    style: "filled",
    width: "default",
    className: {},
  },
};
