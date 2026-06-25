interface HistorialItemProps {
  titulo: string;
  hora: string;
  fecha: string;
}

function HistorialItem({ titulo, hora, fecha }: HistorialItemProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white">
      <p className="text-sm text-slate-700">{titulo}</p>
      <div className="text-right">
        <p className="text-xs font-semibold text-slate-800">{hora}</p>
        <p className="text-xs text-slate-500">{fecha}</p>
      </div>
    </div>
  );
}

export default HistorialItem;
