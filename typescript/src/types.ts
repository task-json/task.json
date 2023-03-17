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


/** @see {isTaskStatus} ts-auto-guard:type-guard */
export type TaskStatus = "todo" | "done" | "removed";

/** @see {isTask} ts-auto-guard:type-guard */
export interface Task {
  id: string;
  status: TaskStatus;
  text: string;
  priority?: string;
  projects?: string[];
  contexts?: string[];
  deps?: string[];
  due?: string;
  wait?: string;
  created: string;
  modified: string;
  done?: string;
}

/** @see {isTaskJson} ts-auto-guard:type-guard */
export type TaskJson = Task[];

export type IndexedTaskJson = Map<string, Task>;

export type DiffStat = {
	created: number,
	modified: number,
	removed: number,
	restored: number
};

