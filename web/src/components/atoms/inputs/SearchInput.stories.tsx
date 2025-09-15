import { Meta, StoryObj } from "@storybook/nextjs-vite";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import { SearchInput } from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Atoms/Inputs/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Reusable component for search input",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outlined", "filled", "minimal"],
      description: "Variant of the search input",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the search input",
    },
    loading: {
      control: "boolean",
      description: "Loading state of the search input",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state of the search input",
    },
    showLabel: {
      control: "boolean",
      description: "Show label of the search input",
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Szukaj historii...",
    variant: "default",
    size: "md",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div>
        <h3 className="text-sm font-medium mb-2">Default (z Figmy)</h3>
        <SearchInput placeholder="Szukaj historii..." variant="default" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Outlined</h3>
        <SearchInput placeholder="Szukaj..." variant="outlined" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Filled</h3>
        <SearchInput placeholder="Szukaj..." variant="filled" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Minimal</h3>
        <SearchInput placeholder="Szukaj..." variant="minimal" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div>
        <h3 className="text-sm font-medium mb-2">Small</h3>
        <SearchInput placeholder="Mały input..." variant="default" size="sm" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Medium</h3>
        <SearchInput
          placeholder="Sredni input..."
          variant="default"
          size="md"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Large</h3>
        <SearchInput placeholder="Duży input..." variant="default" size="lg" />
      </div>
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <SearchInput
        label="Szukaj historii.."
        showLabel
        placeholder="Wpisz frazy kluczowe..."
        helperText="Mozesz szukać po tytule, tresci lub autorze"
      />
      <SearchInput
        label="Wyszukaj uzytkownikow"
        showLabel
        placeholder="NickName lub email..."
        leftIcon={<UserIcon />}
      />
    </div>
  ),
};

export const LoadingState: Story = {
  args: {
    placeholder: "Wyszukiwanie...",
    variant: "default",
    size: "md",
    loading: true,
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: "Wpisz tekst...",
    variant: "outlined",
    error: { message: "To pole jest wymagane", type: "required" },
  },
};
export const Interactive: Story = {
  args: {
    placeholder: "Wpisz coś...",
    variant: "default",
    size: "md",
    showLabel: true,
    label: "Wyszukiwanie",
    helperText: "Rozpocznij pisanie aby wyszukać",
  },
};
