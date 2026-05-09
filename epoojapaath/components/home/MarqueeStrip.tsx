export function MarqueeStrip() {
  const text = "ॐ नमः शिवाय • जय माता दी • हर हर महादेव • जय श्री राम • राधे राधे • जय जिनेन्द्र • वाहेगुरु • ";

  return (
    <div className="bg-deep-gold overflow-hidden py-3 border-y border-saffron/40">
      <div className="flex whitespace-nowrap animate-marquee font-sanskrit text-white text-base tracking-wider">
        <span className="pr-8">{text}</span>
        <span className="pr-8">{text}</span>
        <span className="pr-8">{text}</span>
      </div>
    </div>
  );
}
