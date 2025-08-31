export type Theme = "light";

export const useTheme = () => {
  return {
    theme: "light" as Theme,
    setTheme: () => {},
    toggleTheme: () => {},
  };
};
