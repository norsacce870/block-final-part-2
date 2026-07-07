import { Check } from "lucide-react";
import { useToast } from "@/user/context/ToastProvider";

export default function Toast() {
  const { message } = useToast();

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-7 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-[var(--accent2)]/40 bg-[var(--surface2)] px-5 py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/25 text-[var(--accent2)]">
        <Check className="h-4 w-4" strokeWidth={2.4} />
      </span>
      <span className="text-[14.5px] font-medium text-[var(--text)]">
        {message}
      </span>
    </div>
  );
}
