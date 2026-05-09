interface SectionHeaderProps {
  sanskrit: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeader({ sanskrit, title, subtitle, align = "center" }: SectionHeaderProps) {
  const alignClass = align === "left" ? "text-left" : "text-center";
  return (
    <div className={`mb-12 ${alignClass}`}>
      {/* Sanskrit label with lotus gradient */}
      <p
        className="font-medium mb-2 font-sanskrit text-sm tracking-widest uppercase"
        style={{ background: "linear-gradient(135deg, #EC9DD4, #C4AAEE, #94AAEE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        {sanskrit}
      </p>

      <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-3">{title}</h2>

      {/* Lotus gradient underline accent */}
      <div className={`h-0.5 w-16 rounded-full mb-4 ${align === "center" ? "mx-auto" : ""}`}
        style={{ background: "linear-gradient(90deg, #EC9DD4, #C4AAEE, #94AAEE)" }} />

      {subtitle && (
        <p className={`text-muted-foreground leading-relaxed ${align === "center" ? "max-w-xl mx-auto" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
