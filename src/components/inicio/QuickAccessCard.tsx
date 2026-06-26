import { cn } from "@utils/cn";

interface QuickAccessCardProps {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  delay?: number;
}

function QuickAccessCard({ label, icon, onClick, className, delay = 0 }: QuickAccessCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-6 text-center shadow-sm",
        "hover:-translate-y-1 hover:shadow-lg hover:border-[#2db5a3]/30 active:scale-95",
        "transition-all duration-200 ease-out",
        "opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards]",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#e8f5f3] group-hover:bg-[#d0ede9] transition-colors">
        {icon}
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">{label}</span>
    </button>
  );
}

export default QuickAccessCard;
