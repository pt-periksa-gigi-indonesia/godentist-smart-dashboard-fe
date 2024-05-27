"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardNav({ items, setOpen }) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-4">
      {items.map((item, index) => (
        item.href && (
          <Link
            key={index}
            href={item.disabled ? "/" : item.href}
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
          >
            <span
              className={cn(
                "group flex items-center rounded-md p-4 text-sm font-medium hover:bg-blue-dentist hover:text-white",
                path === item.href ? "bg-accent" : "transparent",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              <span>{item.title}</span>
            </span>
          </Link>
        )
      ))}
    </nav>
  );
}
