export interface TaskTag {
  label: string;
  className: string;
}

export interface Task {
  id: string;
  title: string;
  tag?: TaskTag;
  due?: string;
  assignees?: string[];
  progress?: number;
}

export interface ColumnType {
  id: string;
  title: string;
  taskIds: string[];
}

export interface NewTaskInput {
  title: string;
  columnId: string;
  tag?: TaskTag;
  due?: string;
  assignees?: string[];
  progress?: number;
}

export type Columns = Record<string, ColumnType>;
export type Tasks = Record<string, Task>;