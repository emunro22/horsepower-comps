'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);
  return categories;
}

export function CompetitionsDesktopMenu() {
  const categories = useCategories();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-2 xl:px-4 py-2.5 text-sm xl:text-base font-semibold text-muted hover:text-foreground transition-colors rounded-lg hover:bg-white/5 whitespace-nowrap"
      >
        Competitions
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 py-1">
            <Link
              href="/competitions"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
            >
              All Competitions
            </Link>
            {categories.length > 0 && <div className="border-t border-border my-1" />}
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/competitions?category=${cat.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function CompetitionsMobileMenu({ onNavigate }: { onNavigate: () => void }) {
  const categories = useCategories();
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
      >
        Competitions
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="pl-4 space-y-1 mt-1">
          <Link
            href="/competitions"
            onClick={onNavigate}
            className="block px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
          >
            All Competitions
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/competitions?category=${cat.slug}`}
              onClick={onNavigate}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
            >
              <span>{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
