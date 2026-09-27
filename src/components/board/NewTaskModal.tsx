import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { tagOptions, teamMembers } from "../../data/board";
import type { ColumnType, NewTaskInput, TaskTag } from "../../types/board";
import { cn } from "../../lib/utils";

interface NewTaskModalProps {
  open: boolean;
  columns: ColumnType[];
  onClose: () => void;
  onCreate: (input: NewTaskInput) => void;
}

function formatDue(value: string) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NewTaskModal({ open, columns, onClose, onCreate }: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [columnId, setColumnId] = useState(columns[0]?.id ?? "backlog");
  const [tag, setTag] = useState<TaskTag | null>(null);
  const [due, setDue] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);

  const reset = () => {
    setTitle("");
    setColumnId(columns[0]?.id ?? "backlog");
    setTag(null);
    setDue("");
    setAssignees([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleAssignee = (member: string) => {
    setAssignees((prev) =>
      prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      columnId,
      tag: tag ?? undefined,
      due: formatDue(due),
      assignees: assignees.length ? assignees : undefined,
      progress: 0,
    });

    reset();
  };

  const labelStyles = "text-xs font-semibold uppercase tracking-wide text-slate-500";
  const inputStyles =
    "mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <label className={labelStyles}>Task title</label>
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Finish literature review"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className={labelStyles}>Column</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {columns.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setColumnId(col.id)}
                      className={cn(
                        "rounded-2xl border px-2 py-2.5 text-xs font-semibold transition",
                        columnId === col.id
                          ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {col.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelStyles}>Tag</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tagOptions.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setTag(tag?.label === option.label ? null : option)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                        option.className,
                        tag?.label === option.label && "ring-2 ring-indigo-400 ring-offset-2"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyles}>Due date</label>
                  <input
                    type="date"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className={labelStyles}>Assignees</label>
                  <div className="mt-2 flex gap-2">
                    {teamMembers.map((member) => (
                      <button
                        key={member}
                        type="button"
                        onClick={() => toggleAssignee(member)}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white transition",
                          assignees.includes(member)
                            ? "bg-indigo-500 ring-2 ring-indigo-300 ring-offset-2"
                            : "bg-slate-300 hover:bg-slate-400"
                        )}
                      >
                        {member}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create Task
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}