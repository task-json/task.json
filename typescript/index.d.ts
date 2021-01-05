export interface Task {
  text: string;
  priority?: string;
  projects?: string[];
  contexts?: string[];
  due?: string;
  start?: string;
  end?: string;
}
