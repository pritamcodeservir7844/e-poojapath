"use client";

import { useState } from "react";
import { X, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { IPujaPackage } from "@/types";

interface Props {
  packages: IPujaPackage[];
  pujaName: string;
  onSelect: (pkg: IPujaPackage) => void;
  onClose: () => void;
}

export function PujaPackageModal({ packages, pujaName, onSelect, onClose }: Props) {
  const [selected, setSelected] = useState<IPujaPackage | null>(packages[0] ?? null);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm md:p-4 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto transform transition-transform translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-3 mb-1 md:hidden" />
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5 line-clamp-1">{pujaName}</p>
            <h2 className="font-heading text-xl text-foreground">Select Number of Devotee(s)</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted">
            <X size={20} />
          </button>
        </div>

        {/* Packages Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {packages.map((pkg) => {
            const isSelected = selected?.label === pkg.label;
            return (
              <button
                key={pkg.label}
                onClick={() => setSelected(pkg)}
                className={`flex flex-col items-center text-center rounded-xl border-2 p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-saffron bg-saffron/5 shadow-md"
                    : "border-border bg-card hover:border-saffron/40"
                }`}
              >
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  {Array.from({ length: Math.min(pkg.maxPersons, 3) }).map((_, i) => (
                    <Users key={i} size={12} />
                  ))}
                </div>
                <p className="font-heading text-foreground text-base mb-1">{pkg.label}</p>
                <p className="font-bold text-saffron text-xl mb-1">{formatCurrency(pkg.price)}</p>
                <p className="text-xs text-muted-foreground">{pkg.persons}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelected(pkg); }}
                  className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? "bg-saffron text-white"
                      : "bg-muted text-muted-foreground hover:bg-saffron/20"
                  }`}
                >
                  Confirm Package
                </button>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        {selected && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
            <div>
              <p className="text-xs text-muted-foreground">Total Offering</p>
              <p className="font-heading text-xl text-saffron">{formatCurrency(selected.price)}</p>
            </div>
            <button
              onClick={() => onSelect(selected)}
              className="btn-saffron px-8 py-2.5 text-sm font-semibold"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
