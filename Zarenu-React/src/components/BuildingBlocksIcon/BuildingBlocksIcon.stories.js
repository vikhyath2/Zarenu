import { BuildingBlocksIcon } from ".";

export default {
  title: "Components/BuildingBlocksIcon",
  component: BuildingBlocksIcon,

  argTypes: {
    stateProp: {
      options: ["enabled", "focused", "pressed", "hovered", "disabled"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    stateProp: "enabled",
    className: {},
    stateLayerClassName: {},
  },
};
