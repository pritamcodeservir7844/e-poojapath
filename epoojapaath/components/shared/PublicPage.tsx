import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AIChat } from "@/components/ai-chat/AIChat";

interface PublicPageProps {
  children: React.ReactNode;
  showAIChat?: boolean;
}

export function PublicPage({ children, showAIChat = false }: PublicPageProps) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Global Subtle Background Mandala */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center z-0 overflow-hidden">
        <svg viewBox="0 0 200 200" className="w-[120%] h-[120%] text-saffron animate-spin-slow">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.1" fill="none" />
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.1" fill="none" />
          {Array.from({ length: 36 }).map((_, i) => (
            <path
              key={i}
              d="M100 100 L100 10 Q105 30 100 50 Q95 30 100 10"
              transform={`rotate(${i * 10} 100 100)`}
              fill="currentColor"
              fillOpacity="0.1"
            />
          ))}
        </svg>
      </div>

      <Navbar />
      <main className="pt-16 relative z-10">{children}</main>
      <Footer />
      {showAIChat && <AIChat />}
    </div>
  );
}
