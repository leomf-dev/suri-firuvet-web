import { Calendar, Clock } from "lucide-react";

interface HistorialItemProps {
  titulo: string;
  hora: string;
  fecha: string;
  delay?: number;
}

function HistorialItem({ titulo, hora, fecha, delay = 0 }: HistorialItemProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 bg-white hover:border-[#2db5a3]/30 hover:shadow-sm transition-all duration-200 opacity-0 animate-[fadeSlideUp_0.4s_ease_forwards]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f5f3]">
          <Calendar className="size-4 text-[#2db5a3]" />
        </div>
        <p className="text-sm font-medium text-slate-700">{titulo}</p>
      </div>
      <div className="flex items-center gap-2 text-right">
        <Clock className="size-3 text-slate-400" />
        <div>
          <p className="text-xs font-semibold text-slate-800">{hora}</p>
          <p className="text-xs text-slate-400">{fecha}</p>
        </div>
      </div>
    </div>
  );
}

export default HistorialItem;
