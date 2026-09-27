import { Bell, ChevronDown, Plus, Search } from "lucide-react";
import { APP_NAME } from "../../config/brand";

interface TopbarProps {
  onNewTask: () => void;
  onSignOut: () => void;
}

export function Topbar({ onNewTask, onSignOut }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-lg shadow-indigo-200 ring-1 ring-slate-200/70">
            <div className="grid grid-cols-2 gap-1">
              <span className="h-2.5 w-2.5 rounded-[4px] bg-indigo-500" />
              <span className="h-2.5 w-2.5 rounded-[4px] bg-violet-400" />
              <span className="h-2.5 w-2.5 rounded-[4px] bg-violet-500" />
              <span className="h-2.5 w-2.5 rounded-[4px] bg-indigo-300" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Workspace
            </p>
            <button className="flex items-center gap-2 text-left">
              <h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-lg font-extrabold text-transparent">
                {APP_NAME}
              </h1>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <kbd className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-400">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-indigo-600">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <button
            onClick={onNewTask}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.03] hover:opacity-95 active:scale-95"
          >
            <Plus className="h-4 w-4" /> New Task
          </button>

          <button
            onClick={onSignOut}
            title="Sign out"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-sm font-bold text-white ring-2 ring-indigo-200 transition hover:from-rose-500 hover:to-rose-600 hover:ring-rose-200"
          >
            AR
          </button>
        </div>
      </div>
    </header>
  );
}