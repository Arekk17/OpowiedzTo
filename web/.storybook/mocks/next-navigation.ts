// Minimalny mock App Routera Next.js na potrzeby Storybooka
// Zapewnia implementacje potrzebne przez komponenty używające `next/navigation`

type RouterMethods = {
  push: (href: string) => void;
  replace: (href: string) => void;
  refresh: () => void;
  back: () => void;
  forward: () => void;
  prefetch: (href: string) => Promise<void>;
};

export const useRouter = (): RouterMethods => {
  return {
    push: () => {},
    replace: () => {},
    refresh: () => {},
    back: () => {},
    forward: () => {},
    prefetch: async () => {},
  };
};

export const usePathname = (): string => {
  if (typeof window !== "undefined") {
    return window.location.pathname;
  }
  return "/";
};

export const useSearchParams = (): URLSearchParams => {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams("");
};

export const notFound = () => {};
export const redirect = (_url: string) => {};
