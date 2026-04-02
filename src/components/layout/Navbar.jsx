"use client";

import { useNavbarLogic } from "./Navbar.logic";
import { NavbarUI } from "./Navbar.ui";

export default function Navbar() {
  const logic = useNavbarLogic();
  return <NavbarUI {...logic} />;
}
