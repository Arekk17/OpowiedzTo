import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const MockUserActions = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => {
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-end gap-8 w-[760px] h-10 flex-1">
        <a
          href="/login"
          className="text-content-primary font-jakarta font-medium text-sm"
        >
          Zaloguj się
        </a>
        <a
          href="/register"
          className="bg-primary text-content-inverse px-4 py-2 rounded-md"
        >
          Zarejestruj się
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-8 w-[760px] h-10 flex-1">
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
    </div>
  );
};

const MockHeader = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => (
  <header className="w-full h-[65px] bg-background-paper border-b border-ui-border">
    <div className="flex items-center justify-between px-10 py-3 h-full">
      <div className="flex items-center gap-8 w-[440px] h-[23px]">
        <div>Logo</div>
        <div>Navigation</div>
      </div>
      <MockUserActions isLoggedIn={isLoggedIn} />
    </div>
  </header>
);

const meta: Meta<typeof MockHeader> = {
  title: "Organisms/Header",
  component: MockHeader,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    isLoggedIn: false,
  },
};

export const LoggedIn: Story = {
  args: {
    isLoggedIn: true,
  },
};
