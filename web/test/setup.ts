import "@testing-library/jest-dom";

// Mock globalnego fetch
global.fetch = jest.fn();

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
}));

// Czyszczenie mocków po każdym teście
afterEach(() => {
  jest.clearAllMocks();
});


