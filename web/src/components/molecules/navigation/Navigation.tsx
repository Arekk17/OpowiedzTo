import { NavLink } from "../../atoms/navigation/NavLink";

export const Navigation = () => (
  <nav className="flex items-center gap-9 w-[262px] h-[21px] text-content-primary">
    <NavLink href="/">Strona główna</NavLink>
    <NavLink href="odkrywaj">Odkrywaj</NavLink>
    <NavLink href="pisz">Pisz</NavLink>
  </nav>
);
