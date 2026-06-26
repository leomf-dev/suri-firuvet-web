import { useState, useRef, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const SIDEBAR_COLLAPSED = 64;
const SIDEBAR_DEFAULT   = 240;
const SIDEBAR_MAX       = 340;
const SIDEBAR_MIN       = 180; // min before snapping while dragging

export default function Layout() {
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [collapsed,     setCollapsed]     = useState(false);
  const [sidebarWidth,  setSidebarWidth]  = useState(SIDEBAR_DEFAULT);
  const [resizing,      setResizing]      = useState(false);
  const startX = useRef(0);
  const startW = useRef(SIDEBAR_DEFAULT);

  const currentWidth = collapsed ? SIDEBAR_COLLAPSED : sidebarWidth;

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (collapsed) return; // can't drag when collapsed
    startX.current = e.clientX;
    startW.current = sidebarWidth;
    setResizing(true);
    e.preventDefault();
  }, [collapsed, sidebarWidth]);

  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: MouseEvent) => {
      const next = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, startW.current + e.clientX - startX.current));
      setSidebarWidth(next);
    };
    const onUp = () => setResizing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [resizing]);

  return (
    <div className={`flex min-h-screen bg-[#f0f5f4] ${resizing ? "select-none cursor-col-resize" : ""}`}>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-[width] duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ width: currentWidth }}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} collapsed={collapsed} />
      </div>

      {/* Resize handle + collapse toggle — desktop only */}
      <div
        className="hidden lg:flex flex-col items-center justify-center w-4 shrink-0 relative group z-10"
        onMouseDown={onMouseDown}
        style={{ cursor: collapsed ? "default" : "col-resize" }}
      >
        {/* Track line */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-teal-100 group-hover:bg-teal-300 transition-colors" />

        {/* Toggle button */}
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setCollapsed(c => !c)}
          className="relative z-10 flex items-center justify-center w-5 h-8 rounded-full bg-white border border-teal-200 shadow-sm hover:border-teal-400 hover:shadow-md hover:scale-110 transition-all"
          title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          <svg
            className="size-2.5 text-teal-500 transition-transform duration-200"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
            viewBox="0 0 8 12" fill="none"
          >
            <path d="M6 1L2 6L6 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 bg-[#f0f5f4]/90 backdrop-blur-sm p-4 lg:hidden border-b border-slate-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/60 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="size-6 text-teal-700" />
          </button>
          <span className="text-lg font-bold text-teal-700">Suri Firuvet</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
