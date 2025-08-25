import { InputField } from ".";

export default {
  title: "Components/InputField",
  component: InputField,

  argTypes: {
    state: {
      options: ["disabled", "error", "default"],
      control: { type: "select" },
    },
    valueType: {
      options: ["placeholder", "default"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    hasLabel: true,
    hasError: false,
    label: "Label",
    error: "Error",
    hasDescription: false,
    description: "Description",
    value: "Value",
    state: "disabled",
    valueType: "placeholder",
    className: {},
    inputClassName: {},
    divClassName: {},
  },
};
