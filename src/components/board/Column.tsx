import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import type { ColumnType, Tasks } from "../../types/board";
import { TaskCard } from "./TaskCard";
import { cn } from "../../lib/utils";

const themes = [
  {
    dot: "bg-violet-500",
    count: "bg-violet-100 text-violet-700",
    ring: "ring-violet-300",
    tint: "from-violet-50/90",
    button: "hover:bg-violet-100 hover:text-violet-700",
  },
  {
    dot: "bg-sky-500",
    count: "bg-sky-100 text-sky-700",
    ring: "ring-sky-300",
    tint: "from-sky-50/90",
    button: "hover:bg-sky-100 hover:text-sky-700",
  },
  {
    dot: "bg-amber-500",
    count: "bg-amber-100 text-amber-700",
    ring: "ring-amber-300",
    tint: "from-amber-50/90",
    button: "hover:bg-amber-100 hover:text-amber-700",
  },
  {
    dot: "bg-emerald-500",
    count: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-300",
    tint: "from-emerald-50/90",
    button: "hover:bg-emerald-100 hover:text-emerald-700",
  },
];

interface ColumnProps {
  column: ColumnType;
  tasks: Tasks;
  index: number;
}

export function Column({ column, tasks, index }: ColumnProps) {
  const theme = themes[index % themes.length];
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <section className="w-80 shrink-0">
      <div
        className={cn(
          "rounded-3xl border border-slate-200/70 bg-gradient-to-b shadow-sm backdrop-blur transition",
          theme.tint,
          "to-white/90",
          isOver && cn("ring-2", theme.ring)
        )}
      >
        <header className="flex items-center justify-between px-4 pb-2 pt-4">
          <div className="flex items-center gap-2.5">
            <span className={cn("h-2.5 w-2.5 rounded-full", theme.dot)} />
            <h2 className="text-sm font-bold text-slate-900">{column.title}</h2>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", theme.count)}>
              {column.taskIds.length}
            </span>
          </div>
          <button className={cn("rounded-xl p-2 text-slate-400 transition", theme.button)}>
            <Plus className="h-4 w-4" />
          </button>
        </header>

        <SortableContext items={column.taskIds} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="min-h-[220px] space-y-3 overflow-y-auto p-3 pt-1">
            {column.taskIds.map((taskId) => {
              const task = tasks[taskId];
              if (!task) return null;
              return <TaskCard key={task.id} task={task} />;
            })}
            {column.taskIds.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 p-6 text-center text-sm font-medium text-slate-400">
                ✨ Drop tasks here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </section>
  );
}