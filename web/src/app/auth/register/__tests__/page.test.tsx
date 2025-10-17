import { render, screen } from "@testing-library/react";
import RegisterPage from "../page";
import * as useAuthHook from "@/hooks/useAuth";
import { ApiError } from "@/types/errors";

jest.mock("@/hooks/useAuth");
jest.mock("@/services/auth.service");

describe("RegisterPage", () => {
  const mockUseAuth = useAuthHook.useAuth as jest.MockedFunction<
    typeof useAuthHook.useAuth
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display error message when signupError exists", () => {
    const mockError = new ApiError(
      "Email już istnieje w systemie",
      409,
      "Conflict",
    );

    mockUseAuth.mockReturnValue({
      signup: jest.fn(),
      isSigningUp: false,
      signupError: mockError,
      signinError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signin: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningIn: false,
      isSigningOut: false,
    });

    render(<RegisterPage />);

    expect(
      screen.getByText("Email już istnieje w systemie"),
    ).toBeInTheDocument();
  });

  it("should not display error when signupError is null", () => {
    mockUseAuth.mockReturnValue({
      signup: jest.fn(),
      isSigningUp: false,
      signupError: null,
      signinError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signin: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningIn: false,
      isSigningOut: false,
    });

    render(<RegisterPage />);

    expect(
      screen.queryByText("Email już istnieje w systemie"),
    ).not.toBeInTheDocument();
  });

  it("should render all required form fields", () => {
    mockUseAuth.mockReturnValue({
      signup: jest.fn(),
      isSigningUp: false,
      signupError: null,
      signinError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signin: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningIn: false,
      isSigningOut: false,
    });

    render(<RegisterPage />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Hasło")).toBeInTheDocument();
    expect(screen.getByLabelText("Potwierdź hasło")).toBeInTheDocument();
    expect(screen.getByLabelText("Nickname")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    mockUseAuth.mockReturnValue({
      signup: jest.fn(),
      isSigningUp: false,
      signupError: null,
      signinError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signin: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningIn: false,
      isSigningOut: false,
    });

    render(<RegisterPage />);

    expect(
      screen.getByRole("button", { name: /zarejestruj się/i }),
    ).toBeInTheDocument();
  });

  it("should display validation error from backend", () => {
    const mockError = new ApiError(
      "Hasło musi zawierać co najmniej 8 znaków",
      400,
      "Bad Request",
    );

    mockUseAuth.mockReturnValue({
      signup: jest.fn(),
      isSigningUp: false,
      signupError: mockError,
      signinError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signin: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningIn: false,
      isSigningOut: false,
    });

    render(<RegisterPage />);

    expect(
      screen.getByText("Hasło musi zawierać co najmniej 8 znaków"),
    ).toBeInTheDocument();
  });

  it("should render gender radio buttons", () => {
    mockUseAuth.mockReturnValue({
      signup: jest.fn(),
      isSigningUp: false,
      signupError: null,
      signinError: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      signin: jest.fn(),
      signout: jest.fn(),
      refetch: jest.fn(),
      isSigningIn: false,
      isSigningOut: false,
    });

    render(<RegisterPage />);

    expect(screen.getByText("Mężczyzna")).toBeInTheDocument();
    expect(screen.getByText("Kobieta")).toBeInTheDocument();
    expect(screen.getByText("Inne")).toBeInTheDocument();
  });
});
