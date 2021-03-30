/** @see {isTask} ts-auto-guard:type-guard */
export interface Task {
  id: string;
  text: string;
  priority?: string;
  projects?: string[];
  contexts?: string[];
  due?: string;
  start: string;
  end?: string;
  modified: string;
}
export declare function isTask(obj: any): obj is Task;

/** @see {isTaskJson} ts-auto-guard:type-guard */
export interface TaskJson {
  todo: Task[],
  done: Task[],
  removed: Task[]
}
export declare function isTaskJson(obj: any): obj is TaskJson;

export type TaskType = "todo" | "done" | "removed";

export declare function initTaskJson(): TaskJson;
export declare function taskUrgency(task: Task): number;
export declare function idToIndex(taskJson: TaskJson, type: TaskType, ids: string[]): number[];
export declare function removeTasks(taskJson: TaskJson, type: TaskType, indexes: number[]): void;
export declare function eraseTasks(taskJson: TaskJson, indexes: number[]): void;
export declare function doTasks(taskJson: TaskJson, indexes: number[]): void;
export declare function undoTasks(taskJson: TaskJson, type: "removed" | "done", indexes: number[]): void;
export declare function mergeTaskJson(...taskJsons: TaskJson[]): TaskJson;
