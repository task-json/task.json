/**
 * Copyright (C) 2020-2023  DCsunset
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/> 
 */

/** @see {isTask} ts-auto-guard:type-guard */
export interface Task {
  id: string;
  text: string;
  priority?: string;
  projects?: string[];
  contexts?: string[];
  deps?: string[];
  due?: string;
  wait?: string;
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

export type IndexedTaskJson = Map<string, {
	type: TaskType,
	task: Task
}>;

export type TaskType = "todo" | "done" | "removed";

export type DiffStat = {
	created: number,
	updated: number,
	removed: number,
	restored: number
};

export declare function initTaskJson(): TaskJson;
export declare function priorityUrgency(priority: string): number;
export declare function startUrgency(start: string): number;
export declare function dueUrgency(due: string): number;
export declare function taskUrgency(task: Task): number;
export declare function idToIndex(taskJson: TaskJson, type: TaskType, ids: string[]): number[];
export declare function removeTasks(taskJson: TaskJson, type: TaskType, indexes: number[]): void;
export declare function eraseTasks(taskJson: TaskJson, indexes: number[]): void;
export declare function doTasks(taskJson: TaskJson, indexes: number[]): void;
export declare function undoTasks(taskJson: TaskJson, type: "removed" | "done", indexes: number[]): void;
export declare function indexTaskJson(taskJson: TaskJson): IndexedTaskJson;
export declare function deindexTaskJson(indexedTaskJson: IndexedTaskJson): TaskJson;
export declare function mergeTaskJson(...taskJsons: TaskJson[]): TaskJson;
export declare function compareMergedTaskJson(original: TaskJson, merged: TaskJson): DiffStat;
export declare function getDepComponent(taskJson: TaskJson, taskIds: string[]): string[];
export declare function getDepChildren(taskJson: TaskJson, taskIds: string[]): string[];
