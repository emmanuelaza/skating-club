'use client';

import * as React from 'react';
import {
  LayoutGrid, Zap, Shield, Circle, Package, Shirt, Wrench, ChevronDown,
} from 'lucide-react';
import { CATEGORIES } from './products-data';

const ICONS = { LayoutGrid, Zap, Shield, Circle, Package, Shirt, Wrench } as const;

interface FilterBarProps {
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  sortOrder: string;
  onSortChange: (order: string) => void;
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Más populares' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'newest', label: 'Más recientes' },
];

export function FilterBar({
  activeCategory,
  onCategoryChange,
  sortOrder,
  onSortChange,
}: FilterBarProps) {
  return (
    <div id="categorias" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Category chips — scrollable on mobile */}
      <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        <div className="flex min-w-max items-center gap-2 pb-1">
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon as keyof typeof ICONS];
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/[0.06] text-[#8B5CF6]'
                    : 'border-[#222222] bg-[#111111] text-[#888888] hover:border-[#333] hover:text-[#F5F5F5]'
                }`}
              >
                <Icon className="size-3.5 shrink-0" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort dropdown */}
      <div className="relative shrink-0">
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-[#222222] bg-[#111111] py-1.5 pl-3 pr-8 text-sm text-[#888888] outline-none transition-colors hover:border-[#333] focus:border-[#8B5CF6] sm:w-auto"
          aria-label="Ordenar productos"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#888888]" />
      </div>
    </div>
  );
}
