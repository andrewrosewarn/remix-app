import { NavLink, useLocation } from "@remix-run/react";
import { RemixNavLinkProps } from "@remix-run/react/dist/components";
import { useEffect, useState } from "react";

export default function AppLink({ to, children, className }: RemixNavLinkProps) {
  const [params, setParams] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Only runs on the initial render to get existing values from storage
    const currentStorage = sessionStorage.getItem(to.toString());
    setParams(sessionStorage.getItem(to.toString()) ?? "");
  }, []);

  useEffect(() => {
    // Updates the session staorage and to prop when the search params change
    if (to === location.pathname) {
      sessionStorage.setItem(to, location.search);
      setParams(location.search);
    }
  }, [location, to]);

  return (
    <NavLink to={`${to}${params}`} className={className}>
      {children}
    </NavLink>
  );
}
