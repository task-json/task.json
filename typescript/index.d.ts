export interface Task {
  uuid: string;
  text: string;
  priority?: string;
  projects?: string[];
  contexts?: string[];
  due?: string;
  start?: string;
  end?: string;
  modified: string;
}

export interface TaskJson {
  todo: Task[],
  done: Task[],
  removed: Task[]
}
