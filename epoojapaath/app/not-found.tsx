import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-center px-4">
      <div className="font-sanskrit text-8xl mb-6 animate-float">🛕</div>
      <p className="font-sanskrit text-saffron text-2xl mb-2">ॐ</p>
      <h1 className="font-heading text-5xl text-cream mb-4">Page Not Found</h1>
      <p className="text-cream/50 text-lg mb-2 font-sanskrit">यह पृष्ठ उपलब्ध नहीं है</p>
      <p className="text-cream/40 max-w-md mb-10">
        The path you seek does not exist, dear devotee. Let us guide you back to the sacred space.
      </p>
      <Link href="/" className="btn-saffron px-10 py-4 text-base">
        Return Home 🪔
      </Link>
    </div>
  );
}
