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
      <p className="text-saffron font-medium mb-2 font-sanskrit">{sanskrit}</p>
      <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">{title}</h2>
      {subtitle && (
        <p className={`text-muted-foreground leading-relaxed ${align === "center" ? "max-w-xl mx-auto" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
