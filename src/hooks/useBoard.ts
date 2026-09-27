import { useEffect, useRef, useState } from "react";
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { supabase } from "../services/supabase";
import type { Columns, NewTaskInput, Task, Tasks } from "../types/board";

interface DbColumn {
  id: string;
  title: string;
  position: number;
}

interface DbTask {
  id: string;
  column_id: string;
  title: string;
  tag_label: string | null;
  tag_class: string | null;
  due_date: string | null;
  progress: number;
  position: number;
}

export function useBoard(enabled: boolean) {
  const [columns, setColumns] = useState<Columns>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Tasks>({});
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadTimer = useRef<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  async function load() {
    const [colsRes, tasksRes] = await Promise.all([
      supabase.from("columns").select("*").order("position"),
      supabase.from("tasks").select("*").order("position"),
    ]);

    if (colsRes.error || tasksRes.error) {
      console.error("Load failed:", colsRes.error?.message, tasksRes.error?.message);
      setLoading(false);
      return;
    }

    const nextColumns: Columns = {};
    const order: string[] = [];

    (colsRes.data as DbColumn[]).forEach((c) => {
      nextColumns[c.id] = { id: c.id, title: c.title, taskIds: [] };
      order.push(c.id);
    });

    const nextTasks: Tasks = {};

    (tasksRes.data as DbTask[]).forEach((t) => {
      nextTasks[t.id] = {
        id: t.id,
        title: t.title,
        tag:
          t.tag_label && t.tag_class
            ? { label: t.tag_label, className: t.tag_class }
            : undefined,
        due: t.due_date ?? undefined,
        progress: t.progress,
      };
      nextColumns[t.column_id]?.taskIds.push(t.id);
    });

    setColumns(nextColumns);
    setColumnOrder(order);
    setTasks(nextTasks);
    setLoading(false);
  }

  // ✅ Only load when signed in, and reload when auth state flips
  useEffect(() => {
    if (enabled) {
      setLoading(true);
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // ✅ Realtime only while signed in
  useEffect(() => {
    if (!enabled) return;

    const scheduleReload = () => {
      if (reloadTimer.current) window.clearTimeout(reloadTimer.current);
      reloadTimer.current = window.setTimeout(() => load(), 150);
    };

    const channel = supabase
      .channel("quad-board")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        scheduleReload
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const addTask = async (input: NewTaskInput) => {
    const { error } = await supabase.from("tasks").insert({
      column_id: input.columnId,
      title: input.title,
      tag_label: input.tag?.label ?? null,
      tag_class: input.tag?.className ?? null,
      due_date: input.due ?? null,
      progress: input.progress ?? 0,
      position: columns[input.columnId]?.taskIds.length ?? 0,
    });

    if (error) console.error("Failed to create task:", error.message);
  };

  async function persistOrder(next: Columns, columnIds: string[]) {
    const updates: { id: string; column_id: string; position: number }[] = [];

    columnIds.forEach((colId) => {
      next[colId]?.taskIds.forEach((taskId, index) => {
        updates.push({ id: taskId, column_id: colId, position: index });
      });
    });

    const { error } = await supabase.from("tasks").upsert(updates);
    if (error) console.error("Failed to save order:", error.message);
  }

  const findCol = (id: string) =>
    columns[id] ? id : Object.values(columns).find((c) => c.taskIds.includes(id))?.id;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks[String(event.active.id)] ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setColumns((prev) => {
      const activeCol = prev[activeId]
        ? activeId
        : Object.values(prev).find((c) => c.taskIds.includes(activeId))?.id;
      const overCol = prev[overId]
        ? overId
        : Object.values(prev).find((c) => c.taskIds.includes(overId))?.id;
      if (!activeCol || !overCol || activeCol === overCol) return prev;

      const activeItems = [...prev[activeCol].taskIds];
      const overItems = [...prev[overCol].taskIds];
      const activeIndex = activeItems.indexOf(activeId);
      if (activeIndex === -1) return prev;

      activeItems.splice(activeIndex, 1);
      const overIndex = prev[overId] ? overItems.length : Math.max(0, overItems.indexOf(overId));
      overItems.splice(overIndex, 0, activeId);

      return {
        ...prev,
        [activeCol]: { ...prev[activeCol], taskIds: activeItems },
        [overCol]: { ...prev[overCol], taskIds: overItems },
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeCol = findCol(activeId);
    const overCol = findCol(overId);
    if (!activeCol || !overCol) return;

    if (activeCol === overCol) {
      const oldIndex = columns[activeCol].taskIds.indexOf(activeId);
      const newIndex = columns[activeCol].taskIds.indexOf(overId);
      if (newIndex === -1 || oldIndex === newIndex) return;

      const next: Columns = {
        ...columns,
        [activeCol]: {
          ...columns[activeCol],
          taskIds: arrayMove(columns[activeCol].taskIds, oldIndex, newIndex),
        },
      };
      setColumns(next);
      persistOrder(next, [activeCol]);
    } else {
      const fromIds = columns[activeCol].taskIds.filter((id) => id !== activeId);
      const targetIds = [...columns[overCol].taskIds];
      const overIndex = targetIds.indexOf(overId);
      const insertAt = overId === overCol || overIndex === -1 ? targetIds.length : overIndex;
      targetIds.splice(insertAt, 0, activeId);

      const next: Columns = {
        ...columns,
        [activeCol]: { ...columns[activeCol], taskIds: fromIds },
        [overCol]: { ...columns[overCol], taskIds: targetIds },
      };
      setColumns(next);
      persistOrder(next, [activeCol, overCol]);
    }
  };

  return {
    columns,
    tasks,
    activeTask,
    sensors,
    columnOrder,
    loading,
    addTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}