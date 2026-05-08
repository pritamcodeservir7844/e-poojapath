import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AIChat } from "@/components/ai-chat/AIChat";

interface PublicPageProps {
  children: React.ReactNode;
  showAIChat?: boolean;
}

export function PublicPage({ children, showAIChat = false }: PublicPageProps) {
  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
      {showAIChat && <AIChat />}
    </>
  );
}
