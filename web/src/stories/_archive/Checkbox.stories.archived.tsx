import type { Meta, StoryObj } from "@storybook/nextjs";
import React, { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Atoms/Inputs/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    checked: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        {...args}
        label="Zgadzam się z warunkami"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

export const Checked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return (
      <Checkbox
        {...args}
        label="Zgadzam się z warunkami"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

export const WithoutLabel: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Disabled: Story = {
  args: {
    label: "Wyłączony checkbox",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Wyłączony zaznaczony checkbox",
    disabled: true,
    checked: true,
  },
};

export const Small: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        {...args}
        label="Mały checkbox"
        size="sm"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

export const Large: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        {...args}
        label="Duży checkbox"
        size="lg"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

export const MultipleCheckboxes: Story = {
  render: () => {
    const [states, setStates] = useState([false, true, false, false, true]);

    const handleChange = (index: number) => (checked: boolean) => {
      setStates((prev) =>
        prev.map((state, i) => (i === index ? checked : state)),
      );
    };

    return (
      <div className="space-y-4">
        <Checkbox
          label="Opcja 1"
          checked={states[0]}
          onChange={handleChange(0)}
        />
        <Checkbox
          label="Opcja 2"
          checked={states[1]}
          onChange={handleChange(1)}
        />
        <Checkbox
          label="Opcja 3"
          checked={states[2]}
          onChange={handleChange(2)}
        />
        <Checkbox label="Opcja 4" disabled />
        <Checkbox label="Opcja 5" disabled checked />
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [formState, setFormState] = useState({
      emailNotifications: false,
      pushNotifications: true,
      privacyPolicy: true,
      newsletter: false,
    });

    const handleFormChange = (field: string) => (checked: boolean) => {
      setFormState((prev) => ({ ...prev, [field]: checked }));
    };

    return (
      <form className="space-y-4 p-6 bg-background-paper rounded-lg border border-ui-border">
        <h3 className="text-lg font-semibold text-content-primary mb-4">
          Preferencje użytkownika
        </h3>

        <div className="space-y-3">
          <Checkbox
            label="Chcę otrzymywać powiadomienia email"
            name="email-notifications"
            checked={formState.emailNotifications}
            onChange={handleFormChange("emailNotifications")}
          />
          <Checkbox
            label="Chcę otrzymywać powiadomienia push"
            name="push-notifications"
            checked={formState.pushNotifications}
            onChange={handleFormChange("pushNotifications")}
          />
          <Checkbox
            label="Zgadzam się z polityką prywatności"
            name="privacy-policy"
            checked={formState.privacyPolicy}
            onChange={handleFormChange("privacyPolicy")}
          />
          <Checkbox
            label="Chcę otrzymywać newsletter"
            name="newsletter"
            checked={formState.newsletter}
            onChange={handleFormChange("newsletter")}
          />
          <Checkbox label="Konto nieaktywne" name="inactive" disabled />
        </div>
      </form>
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-content-primary">
          Small (sm)
        </h4>
        <div className="flex gap-4">
          <Checkbox size="sm" />
          <Checkbox size="sm" checked />
          <Checkbox size="sm" label="Mały checkbox" />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-content-primary">
          Medium (md) - domyślny
        </h4>
        <div className="flex gap-4">
          <Checkbox size="md" />
          <Checkbox size="md" checked />
          <Checkbox size="md" label="Średni checkbox" />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-content-primary">
          Large (lg)
        </h4>
        <div className="flex gap-4">
          <Checkbox size="lg" />
          <Checkbox size="lg" checked />
          <Checkbox size="lg" label="Duży checkbox" />
        </div>
      </div>
    </div>
  ),
};
