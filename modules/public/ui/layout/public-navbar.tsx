"use client";

import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavBody,
  NavItems,
} from "@/components/custom/resizeable-navbar";
import { useState } from "react";
import { navPublics } from "@/modules/public/ui/config";
import { ThemeModeToggle } from "@/components/custom/theme-mode-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavbarLogo } from "@/components/custom/resizeable-navbar";

export const PublicNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navPublics} />
        <div className="flex items-center gap-4">
          <NavbarButton variant="secondary" href="/login">
            Masuk
          </NavbarButton>
          <ThemeModeToggle variant="public" />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navPublics.map((item, idx) => {
            const isActive = pathname === item.link;
            return (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative ${
                  isActive
                    ? "text-black dark:text-white font-medium"
                    : "text-neutral-600 dark:text-neutral-300"
                }`}
              >
                <span className="block">{item.name}</span>
              </Link>
            );
          })}
          <div className="flex w-full flex-col gap-4">
            <div className="w-full flex justify-center">
              <ThemeModeToggle variant="public" />
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};
