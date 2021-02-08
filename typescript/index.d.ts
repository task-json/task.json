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

/** @see {isTaskJson} ts-auto-guard:type-guard */
export interface TaskJson {
  todo: Task[],
  done: Task[],
  removed: Task[]
}

export type TaskType = "todo" | "done" | "removed";

export declare function mergeTaskJson(...taskJsons: TaskJson[]): TaskJson;

export declare function initTaskJson(): TaskJson;
