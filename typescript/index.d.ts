/** @see {isTask} ts-auto-guard:type-guard */
export interface Task {
  uuid: string;
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
export function isTaskJson(obj: any): obj is TaskJson;

export type TaskType = "todo" | "done" | "removed";

export declare function mergeTaskJson(...taskJsons: TaskJson[]): TaskJson;

export declare function initTaskJson(): TaskJson;
