"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: string[];
  className?: string;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, className }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div className={cn("flex flex-wrap gap-2 mb-8", className)}>
      <Link
        href={pathname}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          !currentCategory
            ? "bg-purple-600 text-white"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        All
      </Link>
      
      {categories.map((category) => (
        <Link
          key={category}
          href={`${pathname}?category=${encodeURIComponent(category)}`}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            currentCategory === category
              ? "bg-purple-600 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
      ))}
    </div>
  );
};

export default CategoryNav;