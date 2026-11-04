import { useEffect, useId, useRef, useState } from "react";
import { LuCheck, LuChevronDown } from "react-icons/lu";

export interface SelectOption {
  value: string;
  label: string;
}

interface SeasonSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

const SeasonSelect: React.FC<SeasonSelectProps> = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <span className="block mb-1.5 text-xs text-brand-ink">{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between rounded-lg border border-[#b9c7b5] bg-white px-4 py-3 text-sm text-brand-ink hover:border-brand-green focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50 transition-colors"
      >
        <span>{selected?.label ?? value}</span>
        <LuChevronDown className={`text-lg transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-md border border-[#d9d9d9] bg-white py-1 shadow-[0_8px_24px_rgba(15,37,36,0.18)]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-brand-ink transition-colors ${
                    isSelected ? "bg-[#ececec]" : "hover:bg-[#f4f4f4]"
                  }`}
                >
                  <span className="w-4 text-base">{isSelected && <LuCheck />}</span>
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SeasonSelect;
