import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PhoneInput } from "./PhoneInput";

const meta: Meta<typeof PhoneInput> = {
  title: "Components/PhoneInput",
  component: PhoneInput,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
  args: {
    defaultCountry: "us",
    placeholder: "Enter mobile number"
  }
};

export const Disabled: Story = {
  args: {
    defaultCountry: "gb",
    disabled: true,
    value: "+447911123456"
  }
};

export const CustomTheme: Story = {
  render: () => (
    <div
      style={
        {
          "--pi-border-color": "#a8a29e",
          "--pi-border-color-focus": "#ea580c",
          "--pi-bg": "#fafaf9",
          "--pi-text-main": "#44403c",
          "--pi-border-radius": "12px",
          "--pi-height": "48px"
        } as React.CSSProperties
      }
    >
      <PhoneInput defaultCountry="de" placeholder="Custom theme input" />
    </div>
  )
};
