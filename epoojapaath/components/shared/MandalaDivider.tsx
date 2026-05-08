export function MandalaDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <svg width="400" height="40" viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="20" x2="155" y2="20" stroke="#D4820A" strokeOpacity="0.25" strokeWidth="1" />
        <g transform="translate(200, 20)">
          <circle cx="0" cy="0" r="14" stroke="#D4820A" strokeOpacity="0.4" strokeWidth="1" fill="none" />
          <circle cx="0" cy="0" r="8"  stroke="#B8860B" strokeOpacity="0.5" strokeWidth="1" fill="none" />
          <circle cx="0" cy="0" r="3"  fill="#D4820A" fillOpacity="0.6" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="0" y1="-8"
              x2="0" y2="-14"
              stroke="#D4820A"
              strokeOpacity="0.5"
              strokeWidth="1"
              transform={`rotate(${angle})`}
            />
          ))}
          {[-25, -20, 20, 25].map((x) => (
            <circle key={x} cx={x} cy="0" r="2" fill="#D4820A" fillOpacity="0.4" />
          ))}
        </g>
        <line x1="245" y1="20" x2="400" y2="20" stroke="#D4820A" strokeOpacity="0.25" strokeWidth="1" />
      </svg>
    </div>
  );
}
