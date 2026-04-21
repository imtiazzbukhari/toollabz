"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Sparkles, User, X } from "lucide-react";

const nav = [
  { label: "Tools", href: "/tools" },
  { label: "Categories", href: "/#categories" },
  { label: "Popular Tools", href: "/#popular-tools" },
  { label: "Converters", href: "/utility-tools" },
  { label: "Calculators", href: "/finance-tools" },
  { label: "Blog", href: "/blog" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-[1240px] items-center justify-between gap-2 px-3 sm:h-[70px] sm:px-4 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 text-slate-900"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0a0a12] p-1 shadow-sm ring-1 ring-slate-200/80 sm:h-10 sm:w-10">
            <Image
              src="/logo-toollabz.webp"
              alt=""
              width={32}
              height={32}
              className="h-7 w-7 object-contain sm:h-8 sm:w-8"
              priority
              sizes="40px"
              aria-hidden
            />
          </span>
          <span className="whitespace-nowrap bg-gradient-to-r from-slate-900 via-violet-800 to-blue-700 bg-clip-text text-base font-bold tracking-tight text-transparent sm:text-lg">
            Toollabz
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-slate-600 lg:flex xl:gap-6">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(item.href.split("?")[0]);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`inline-flex items-center border-b-2 pb-1 transition duration-300 hover:text-violet-600 ${
                  active
                    ? "border-violet-500 text-violet-600"
                    : "border-transparent text-slate-600"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/tools"
            aria-label="Search tools"
            className="rounded-full p-2 text-slate-500 transition duration-300 hover:bg-violet-50 hover:text-violet-600"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/login"
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-slate-700 transition duration-300 hover:bg-violet-50 hover:text-violet-600 sm:inline-flex md:px-4"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            <span>Login</span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-500 px-3 py-2 text-xs font-medium text-white shadow-[0_10px_24px_rgba(76,29,149,0.28)] transition duration-300 hover:brightness-110 sm:px-4 sm:text-sm"
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
            Sign Up
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[60px] z-40 lg:hidden sm:top-[70px]">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="relative max-h-[min(72vh,32rem)] overflow-y-auto border-b border-slate-200/80 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-xl">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(item.href.split("?")[0]);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`block rounded-xl px-3 py-3 text-base font-medium transition hover:bg-violet-50 ${
                        active ? "text-violet-600" : "text-slate-800"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110"
                onClick={() => setMenuOpen(false)}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
