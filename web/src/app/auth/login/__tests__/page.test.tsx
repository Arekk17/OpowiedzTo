import { render, screen } from "@testing-library/react";
import LoginPage from "../page";
import * as useAuthHook from "@/hooks/useAuth";
import { ApiError } from "@/types/errors";

jest.mock("@/hooks/useAuth");

describe("LoginPage", () => {
  const mockUseAuth = useAuthHook.useAuth as jest.MockedFunction<
    typeof useAuthHook.useAuth
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display error message when signinError exists", () => {
    const mockError = new ApiError(
      "Nieprawidłowy email lub hasło",
      401,
      "Unauthorized"
    );

    mockUseAuth.mockReturnValue({
      signin: jest.fn(),
      isSigningIn: false,
      signinError: mockError,
      signupError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signup: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningUp: false,
      isSigningOut: false,
    });

    render(<LoginPage />);

    expect(
      screen.getByText("Nieprawidłowy email lub hasło")
    ).toBeInTheDocument();
  });

  it("should not display error when signinError is null", () => {
    mockUseAuth.mockReturnValue({
      signin: jest.fn(),
      isSigningIn: false,
      signinError: null,
      signupError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signup: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningUp: false,
      isSigningOut: false,
    });

    render(<LoginPage />);

    expect(
      screen.queryByText("Nieprawidłowy email lub hasło")
    ).not.toBeInTheDocument();
  });

  it("should render email and password inputs", () => {
    mockUseAuth.mockReturnValue({
      signin: jest.fn(),
      isSigningIn: false,
      signinError: null,
      signupError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signup: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningUp: false,
      isSigningOut: false,
    });

    render(<LoginPage />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Hasło")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    mockUseAuth.mockReturnValue({
      signin: jest.fn(),
      isSigningIn: false,
      signinError: null,
      signupError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signup: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningUp: false,
      isSigningOut: false,
    });

    render(<LoginPage />);

    expect(
      screen.getByRole("button", { name: /zaloguj się/i })
    ).toBeInTheDocument();
  });

  it("should display different error messages", () => {
    const mockError = new ApiError(
      "Konto zostało zablokowane",
      403,
      "Forbidden"
    );

    mockUseAuth.mockReturnValue({
      signin: jest.fn(),
      isSigningIn: false,
      signinError: mockError,
      signupError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signup: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningUp: false,
      isSigningOut: false,
    });

    render(<LoginPage />);

    expect(screen.getByText("Konto zostało zablokowane")).toBeInTheDocument();
  });
});


