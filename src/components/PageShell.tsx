import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

export interface PageTab {
  id: string;
  label: string;
}

interface PageShellProps {
  title: string;
  tabs?: PageTab[];
  activeTab?: string | null;
  onTabChange?: (id: string) => void;
  children: ReactNode;
}

const PageShell: React.FC<PageShellProps> = ({ title, tabs, activeTab, onTabChange, children }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-grow">
      <header className="sticky top-0 z-30 bg-brand-green text-white shadow-[0_2px_12px_rgba(15,37,36,0.25)]">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-[44px_1fr_44px] items-center h-14 sm:h-16">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Powrót do strony głównej"
              className="h-10 w-10 -ml-2 flex items-center justify-center rounded-full text-xl hover:bg-white/15 transition-colors"
            >
              <LuArrowLeft />
            </button>
            <h1 className="text-center text-lg sm:text-xl font-medium">{title}</h1>
            <div aria-hidden="true" />
          </div>

          {tabs && tabs.length > 0 && (
            <nav
              role="tablist"
              className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center"
            >
              {tabs.map((tab) => {
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onTabChange?.(tab.id)}
                    className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 pt-1 pb-2.5 text-sm border-b-2 transition-colors ${
                      active
                        ? "border-white font-semibold"
                        : "border-transparent text-white/85 hover:text-white hover:border-white/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
};

export default PageShell;
