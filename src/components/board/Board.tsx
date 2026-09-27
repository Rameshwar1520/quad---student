import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import type { useBoard } from "../../hooks/useBoard";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";

interface BoardProps {
  board: ReturnType<typeof useBoard>;
}

export function Board({ board }: BoardProps) {
  const {
    columns,
    tasks,
    activeTask,
    sensors,
    columnOrder,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = board;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 overflow-x-auto pb-8">
        {columnOrder.map((colId, index) => (
          <Column key={colId} column={columns[colId]} tasks={tasks} index={index} />
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} />}
      </DragOverlay>
    </DndContext>
  );
}