"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-2 w-10 h-10 rounded-xl bg-saffron/5" />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-1 text-saffron transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={24} className="text-amber-400" />
      ) : (
        <Moon size={24} className="text-saffron" />
      )}
    </motion.button>
  );
}
