import { cn } from "@utils/cn";

interface QuickAccessCardProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function QuickAccessCard({ label, icon, onClick, className }: QuickAccessCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#e8f5f3]">
        {icon}
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">{label}</span>
    </button>
  );
}

export default QuickAccessCard;
