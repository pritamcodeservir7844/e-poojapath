interface PageHeroProps {
  sanskrit: string;
  title: string;
  subtitle?: string;
}

export function PageHero({ sanskrit, title, subtitle }: PageHeroProps) {
  return (
    <section className="py-16 bg-dark text-center">
      <p className="font-sanskrit text-saffron mb-3 text-lg">{sanskrit}</p>
      <h1 className="font-heading text-5xl text-cream mb-4">{title}</h1>
      {subtitle && <p className="text-cream/60 max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
    </section>
  );
}
