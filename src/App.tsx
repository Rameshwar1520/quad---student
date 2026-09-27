import { useState } from "react";
import { Topbar } from "./components/layout/Topbar";
import { Board } from "./components/board/Board";
import { NewTaskModal } from "./components/board/NewTaskModal";
import { AuthPage } from "./pages/AuthPage";
import { APP_TAGLINE } from "./config/brand";
import { useBoard } from "./hooks/useBoard";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./services/supabase";
import { teamMembers } from "./data/board";
import { memberColors } from "./components/board/TaskCard";

export default function App() {
  const { session, loading } = useAuth();
  const board = useBoard(!!session);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  if (board.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
      </div>
    );
  }

  const totalTasks = board.columnOrder.reduce(
    (sum, colId) => sum + (board.columns[colId]?.taskIds.length ?? 0),
    0
  );
  const doneCount = board.columns[board.columnOrder[board.columnOrder.length - 1]]?.taskIds.length ?? 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#eef2ff,#f8fafc_35%,#ffffff)]">
      {/* Floating gradient blobs */}
      <div className="animate-float pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-200/50 blur-3xl" />
      <div className="animate-float-slow pointer-events-none absolute -right-20 top-32 h-96 w-96 rounded-full bg-fuchsia-200/40 blur-3xl" />
      <div className="animate-float pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative">
        <Topbar
          onNewTask={() => setIsNewTaskOpen(true)}
          onSignOut={() => supabase.auth.signOut()}
        />

        <main className="mx-auto max-w-[1400px] px-6 py-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-indigo-500">CS301 Group Project</p>
              <h2 className="mt-2 bg-gradient-to-r from-slate-900 via-indigo-800 to-violet-700 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                Product Launch Board
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{APP_TAGLINE}</p>

              {/* Live stats chips */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {totalTasks} tasks
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {doneCount} done
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-amber-100 bg-white/80 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {totalTasks - doneCount} open
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {teamMembers.map((member) => (
                  <div
                    key={member}
                    title={member}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white transition-transform hover:scale-110 ${
                      memberColors[member] ?? "bg-violet-500"
                    }`}
                  >
                    {member}
                  </div>
                ))}
              </div>
              <button className="rounded-2xl border border-indigo-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50">
                Invite
              </button>
            </div>
          </div>

          <Board board={board} />
        </main>
      </div>

      <NewTaskModal
        open={isNewTaskOpen}
        columns={board.columnOrder.map((id) => board.columns[id])}
        onClose={() => setIsNewTaskOpen(false)}
        onCreate={(input) => {
          board.addTask(input);
          setIsNewTaskOpen(false);
        }}
      />
    </div>
  );
}