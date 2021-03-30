import { Task, TaskJson, TaskType } from "../index";
import { DateTime, Interval } from "luxon";
import * as _ from "lodash";
export * from "./type.guard";

export function initTaskJson(): TaskJson {
	return {
		todo: [],
		done: [],
		removed: []
	};
}

export function taskUrgency(task: Task): number {
  let urg = 0;
  if (task.priority) {
    urg += "Z".charCodeAt(0) - task.priority.charCodeAt(0) + 2;
  }
  if (task.due) {
    const interval = Interval.fromDateTimes(
      DateTime.local(),
      DateTime.fromISO(task.due)
    );
    const days = interval.length("days");
		if (!interval.isValid) {
			urg += 4000;
		}
    else if (days < 3) {
      urg += 1000 * (3 - days);
    }
    else if (days < 7) {
      urg += 100 * (7 - days);
    }
    else {
      urg += 0.1;
    }
  }
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
export function eraseTasks(taskJson: TaskJson, indexes: number[]) {
	const indexSet = new Set(indexes);
	_.remove(taskJson.removed, (_, index) => indexSet.has(index));
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

export function mergeTaskJson(...taskJsons: TaskJson[]): TaskJson {
	const tasks: Map<string, {
		type: TaskType,
		task: Task
	}> = new Map();
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

	const result = initTaskJson();
	for (const { type, task } of tasks.values()) {
		result[type].push(task);
	}

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
