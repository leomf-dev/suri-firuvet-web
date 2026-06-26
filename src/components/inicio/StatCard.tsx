import { cn } from "@utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  statusLabel?: string;
  statusColor?: "green" | "yellow" | "red";
  progress?: number;
  backgroundClass?: string;
  className?: string;
  delay?: number;
}

function StatCard({
  title,
  value,
  icon,
  statusLabel,
  statusColor = "green",
  progress = 75,
  backgroundClass = "bg-teal-600",
  className,
  delay = 0,
}: StatCardProps) {
  const statusColors = { green: "bg-white", yellow: "bg-orange-400", red: "bg-red-300" };

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-[1.5rem] p-5 text-white shadow-md min-w-[160px]",
        "opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards]",
        backgroundClass,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-4xl font-bold tracking-tight tabular-nums">{value}</p>
          <p className="whitespace-pre-line text-sm font-medium opacity-90 mt-1 leading-tight">{title}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shrink-0">
          {icon}
        </div>
      </div>
      {statusLabel && (
        <div className="mt-5 space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/80">{statusLabel}</p>
          <div className="h-1.5 rounded-full bg-black/20 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-1000 ease-out", statusColors[statusColor])}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StatCard;
