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

import { DateTime } from "luxon";


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

export function priorityUrgency(priority: string): number {
  return "Z".charCodeAt(0) - priority.charCodeAt(0) + 2;
}

export function createdUrgency(created: string): number {
	const days = -DateTime.fromISO(created).diffNow("days").days;
	if (days <= 0)
		return 0;
	return Math.exp(-1 / days);
}

export function dueUrgency(due: string): number {
	const days = DateTime.fromISO(due).diffNow("days").days;

	if (days <= 0) {
		return 4000;
	}
	else if (days < 3) {
		return 1000 * (4 - days);
	}
	else if (days < 7) {
		return 100 * (13 - days);
	}
	else {
		return 1;
	}
}

export function taskUrgency(task: Task): number {
	// Only check todo task's urgency
	if (task.status !== "todo")
		return 0;

  let urg = createdUrgency(task.created);
	if (task.priority)
		urg += priorityUrgency(task.priority);
  if (task.due)
		urg += dueUrgency(task.due);
  return urg;
}

export function removeTasks(taskJson: TaskJson, ids: string[]): TaskJson {
	const date = new Date().toISOString();
	const idSet = new Set(ids);

	return taskJson.map(task => (
		idSet.has(task.id) ? {
			...task,
			status: "removed",
			modified: date,
		} : task
	));
}

// Erase removed tasks permanently
export function eraseTasks(taskJson: TaskJson, ids: string[]): TaskJson {
	const idSets = new Set(ids);

	return taskJson
		.filter(task => !idSets.has(task.id))
		.map(task => {
			// Remove dependencies in parent to avoid reference errors
			let deps = task.deps?.filter(dep => !idSets.has(dep));
			if (!deps?.length) {
				// Remove field if empty
				deps = undefined;
			}
			return { ...task, deps };
		});
}

export function doTasks(taskJson: TaskJson, ids: string[]): TaskJson {
	const date = new Date().toISOString();
	const idSet = new Set(ids);

	return taskJson.map(task => (
		(idSet.has(task.id) && task.status === "todo") ? {	
			...task,
			status: "done",
			done: date,
			modified: date
		} : task
	));
}

// Undo tasks that are done or removed
export function undoTasks(taskJson: TaskJson, ids: string[]): TaskJson {
	const date = new Date().toISOString();
	const idSet = new Set(ids);

	return taskJson.map(task => (
		(idSet.has(task.id) && task.status !== "todo") ? {	
			...task,
			// If done is set and status is removed, change it from removed to done.
			// Otherwise, change to todo
			status: (task.status === "removed" && task.done) ? "done" : "todo",
			// Only remove the done date when change from done to todo
			done: task.status === "done" ? undefined : task.done,
			modified: date
		} : task
	));
}


// index taskJson by id
export function indexTaskJson(taskJson: TaskJson): IndexedTaskJson {
	const tasks: IndexedTaskJson = new Map();

	for (const task of taskJson)
		tasks.set(task.id, task);
	return tasks;
}

export function mergeTaskJson(...taskJsons: TaskJson[]): TaskJson {
	const tasks: IndexedTaskJson = new Map();

	for (const taskJson of taskJsons) {
		for (const task of taskJson) {
			if (tasks.has(task.id)) {
				// Compare timestamp
				const current = DateTime.fromISO(task.modified);
				const existing = DateTime.fromISO(tasks.get(task.id)!.modified);

				// Update tasks only if current > existing
				if (current <= existing)
					continue;
			}

			tasks.set(task.id, task);
		}
	}

	const result = [...tasks.values()];
	// Sort tasks by created date
	result.sort((left, right) => {
		const leftDate = DateTime.fromISO(left.created);
		const rightDate = DateTime.fromISO(right.created);
		return leftDate < rightDate ? -1 : 1;
	});

	return result;
}

// pre-condition: merged = mergeTaskJson(..., original, ...)
export function compareMergedTaskJson(original: TaskJson, merged: TaskJson): DiffStat {
	const diff: DiffStat = {
		created: 0,
		modified: 0,
		removed: 0,
		restored: 0
	};
	const indexedOriginal = indexTaskJson(original);
	const indexedMerged = indexTaskJson(merged);

	// merged must include all tasks in original
	for (const [id, mergedTask ] of indexedMerged.entries()) {
		if (indexedOriginal.has(id)) {
			const originalTask = indexedOriginal.get(id)!;
			// Unmodified
			if (originalTask.status === mergedTask.status) {
				if (mergedTask.modified !== originalTask.modified)
					++diff.modified;
			}
			else if (mergedTask.status === "removed")
				++diff.removed;
			else if (originalTask.status === "removed")
				++diff.restored;
			else
				++diff.modified; // Type modified
		}
		else {
			++diff.created;
		}
	}

	return diff;
}

// Search for a graph component
function getComponent(ids: string[], adjacent: Map<string, string[]>) {
	// ids are start points
	// DFS (using stack instead of queue for efficiency)
	const component: Set<string> = new Set();
	const stack = [...ids];
	while (stack.length > 0) {
		const current = stack.pop()!;
		if (component.has(current))
			continue;
		component.add(current);
		if (adjacent.has(current))
			stack.push(...adjacent.get(current)!);
	}

	return [...component];
}

// Get a task's connected component in dependency graph
export function getDepComponent(taskJson: TaskJson, ids: string[]) {
	// Build a bidirectional adjacent list first
	const adjacent: Map<string, string[]> = new Map();

	const addEdges = (task: Task) => {
		if (task.deps) {
			const origList = adjacent.get(task.id) ?? [];
			adjacent.set(task.id, origList.concat(task.deps));
			// Change it to undirected graph
			for (const dep of task.deps) {
				if (!adjacent.get(dep))
					adjacent.set(dep, []);
				adjacent.get(dep)!.push(task.id);
			}
		}
	};

	for (const task of taskJson)
		addEdges(task);

	return getComponent(ids, adjacent);
}

// Get a task's dependant children (including indirect ones)
export function getDepChildren(taskJson: TaskJson, taskIds: string[]) {
	// Build a reverse adjacent list first
	const adjacent: Map<string, string[]> = new Map();

	const addEdges = (task: Task) => {
		if (task.deps) {
			for (const dep of task.deps) {
				if (!adjacent.get(dep))
					adjacent.set(dep, []);
				adjacent.get(dep)!.push(task.id);
			}
		}
	};

	for (const task of taskJson)
		addEdges(task);

	return getComponent(taskIds, adjacent);
}

/// Serialize TaskJson into string
export function serializeTaskJson(taskJson: TaskJson) {
	return taskJson
		.map(task => JSON.stringify(task))
		.join("\n");
}

/// Deserialize string into TaskJson
export function deserializeTaskJson(data: string): TaskJson {
	return data
		.trim()  // Trim white spaces to avoid empty lines
		.split("\n")
		.map(line => JSON.parse(line));
}
