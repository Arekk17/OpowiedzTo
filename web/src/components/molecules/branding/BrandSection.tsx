import { Logo } from "../../atoms/branding/Logo";
import { Navigation } from "../navigation/Navigation";

export const BrandSection = () => (
  <div className="flex items-center gap-8 w-[440px] h-[23px]">
    <Logo />
    <Navigation />
  </div>
);
