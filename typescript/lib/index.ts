import { Task, TaskJson, TaskType, DiffStat, IndexedTaskJson } from "../index";
import { DateTime } from "luxon";
import * as _ from "lodash";
export * from "./type.guard";

export function initTaskJson(): TaskJson {
	return {
		todo: [],
		done: [],
		removed: []
	};
}

export function priorityUrgency(priority: string): number {
  return "Z".charCodeAt(0) - priority.charCodeAt(0) + 2;
}

export function startUrgency(start: string): number {
	const days = -DateTime.fromISO(start).diffNow("days").days;
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
  let urg = startUrgency(task.start);
	if (task.priority)
		urg += priorityUrgency(task.priority);
  if (task.due)
		urg += dueUrgency(task.due);
  return urg;
}

export function idToIndex(taskJson: TaskJson, type: TaskType, ids: string[]): number[] {
	const idSet = new Set(ids);
	const indexes: number[] = [];

	taskJson[type].forEach((task, index) => {
		if (idSet.has(task.id)) {
			indexes.push(index);
		}
	});
	return indexes;
}

export function removeTasks(taskJson: TaskJson, type: TaskType, indexes: number[]): void {
	const date = new Date().toISOString();
	const indexSet = new Set(indexes);

	const removedTasks = _.remove(taskJson[type], (_, index) => indexSet.has(index))
		.map(task => {
			task.modified = date;
			return task;
		});
	taskJson.removed.push(...removedTasks);
}

// Erase removed tasks permanently
export function eraseTasks(taskJson: TaskJson, indexes: number[]): void {
	const indexSet = new Set(indexes);
	const erasedTasks = _.remove(taskJson.removed, (_, index) => indexSet.has(index));

	// Remove dependencies in parent to prevent reference errors
	const erasedIds = new Set(erasedTasks.map(task => task.id));
	const types: TaskType[] = ["todo", "done", "removed"];
	for (const type of types)
		for (const task of taskJson[type]) {
			if (task.deps) {
				const newDeps = task.deps.filter(dep => !erasedIds.has(dep));
				if (newDeps.length === 0)
					delete task.deps;
				else
					task.deps = newDeps;
			}
		}
}

export function doTasks(taskJson: TaskJson, indexes: number[]): void {
	const date = new Date().toISOString();
	const indexSet = new Set(indexes);
	const doneTasks = _.remove(taskJson.todo, (_, index) => indexSet.has(index))
		.map(task => {
			task.end = date;
			task.modified = date;
			return task;
		});
	taskJson.done.push(...doneTasks);
}

export function undoTasks(taskJson: TaskJson, type: "removed" | "done", indexes: number[]): void {
	const date = new Date().toISOString();
	const indexSet = new Set(indexes);
	const undoneTasks = _.remove(taskJson[type], (_, index) => indexSet.has(index))
		.map(task => {
			task.modified = date;
			return task;
		});
	const doneTasks = undoneTasks.filter(task => type === "removed" && task.end);
	const todoTasks = undoneTasks.filter(task => type === "done" || !task.end);
	todoTasks.forEach(task => {
		delete task.end;
		return task;
	});
	taskJson.todo.push(...todoTasks);
	taskJson.done.push(...doneTasks);
}


// index taskJson
export function indexTaskJson(taskJson: TaskJson): IndexedTaskJson {
	const tasks: IndexedTaskJson = new Map();
	const types: TaskType[] = ["todo", "done", "removed"];

	for (const type of types)
		for (const task of taskJson[type])
			tasks.set(task.id, { type, task });
	return tasks;
}

// deindex indexedTaskJson
export function deindexTaskJson(indexedTaskJson: IndexedTaskJson): TaskJson {
	const taskJson = initTaskJson();
	for (const { type, task } of indexedTaskJson.values()) {
		taskJson[type].push(task);
	}
	return taskJson;
}

export function mergeTaskJson(...taskJsons: TaskJson[]): TaskJson {
	const tasks: IndexedTaskJson = new Map();
	const types: TaskType[] = ["todo", "done", "removed"];

	for (const type of types) {
		for (const taskJson of taskJsons) {
			for (const task of taskJson[type]) {
				if (tasks.has(task.id)) {
					// Compare timestamp
					const current = DateTime.fromISO(task.modified);
					const existing = DateTime.fromISO(tasks.get(task.id)!.task.modified);

					// Update tasks only if current > existing
					if (current <= existing)
						continue;
				}

				tasks.set(task.id, { type, task });
			}
		}
	}

	const result = deindexTaskJson(tasks);
	// Sort tasks by start date
	for (const type of types) {
		result[type].sort((left, right) => {
			const startLeft = DateTime.fromISO(left.start);
			const startRight = DateTime.fromISO(right.start);
			return startLeft < startRight ? -1 : 1;
		});
	}

	return result;
}

// pre-condition: merged = mergerTaskJson(...[original, ...])
export function compareMergedTaskJson(original: TaskJson, merged: TaskJson): DiffStat {
	const diff: DiffStat = {
		created: 0,
		updated: 0,
		removed: 0,
		restored: 0
	};
	const indexedOriginal = indexTaskJson(original);
	const indexedMerged = indexTaskJson(merged);

	// merged must include all tasks in original
	for (const [id, { type: mergedType, task: mergedTask }] of indexedMerged.entries()) {
		if (indexedOriginal.has(id)) {
			const { type: originalType, task: originalTask } = indexedOriginal.get(id)!;
			// Unmodified
			if (originalType === mergedType) {
				if (!_.isEqual(mergedTask, originalTask))
					++diff.updated; // Update info
			}
			else if (mergedType === "removed")
				++diff.removed;
			else if (originalType === "removed")
				++diff.restored;
			else
				++diff.updated; // Update type
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
export function getDepComponent(taskJson: TaskJson, taskIds: string[]): string[] {
	// Build a bidirectional adjacent list first
	const adjacent: Map<string, string[]> = new Map();
	const types: TaskType[] = ["todo", "done", "removed"];

	const addEdges = (task: Task) => {
		if (task.deps) {
			const origlist = adjacent.get(task.id) ?? [];
			adjacent.set(task.id, origlist.concat(task.deps));
			for (const dep of task.deps) {
				if (!adjacent.get(dep))
					adjacent.set(dep, []);
				adjacent.get(dep)!.push(task.id);
			}
		}
	};

	for (const type of types)
		for (const task of taskJson[type])
			addEdges(task);

	return getComponent(taskIds, adjacent);
}

// Get a task's dependant children (including indirect ones)
export function getDepChildren(taskJson: TaskJson, taskIds: string[]): string[] {
	// Build a reverse adjacent list first
	const adjacent: Map<string, string[]> = new Map();
	const types: TaskType[] = ["todo", "done", "removed"];

	const addEdges = (task: Task) => {
		if (task.deps) {
			for (const dep of task.deps) {
				if (!adjacent.get(dep))
					adjacent.set(dep, []);
				adjacent.get(dep)!.push(task.id);
			}
		}
	};

	for (const type of types)
		for (const task of taskJson[type])
			addEdges(task);

	return getComponent(taskIds, adjacent);
}
