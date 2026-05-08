const CATEGORIES = [
  { value: "",              label: "All"          },
  { value: "devotional",    label: "Devotional"   },
  { value: "temple-story",  label: "Temple Story" },
  { value: "festival",      label: "Festival"     },
  { value: "astrology",     label: "Astrology"    },
  { value: "announcement",  label: "Announcement" },
];

export function CategoryTabs({ active }: { active?: string }) {
  return (
    <section className="py-4 bg-card-bg border-b border-deep-gold/20 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-2 min-w-max">
        {CATEGORIES.map(({ value, label }) => {
          const isActive = (value === "" && !active) || active === value;
          return (
            <a
              key={value}
              href={value ? `/blog?category=${value}` : "/blog"}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-saffron text-white"
                  : "bg-background text-muted-foreground hover:bg-saffron/10 hover:text-saffron border border-deep-gold/20"
              }`}
            >
              {label}
            </a>
          );
        })}
      </div>
    </section>
  );
}
