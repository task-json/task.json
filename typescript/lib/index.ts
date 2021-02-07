import { Task, TaskJson, TaskType } from "../index";
import { DateTime, Interval } from "luxon";

export function initTaskJson(): TaskJson {
	return {
		todo: [],
		done: [],
		removed: []
	};
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
				if (tasks.has(task.uuid)) {
					// Compare timestamp
					const current = DateTime.fromISO(task.modified);
					const existing = DateTime.fromISO(tasks.get(task.uuid)!.task.modified);

					// Update tasks only if current > existing
					if (current <= existing)
						continue;
				}

				tasks.set(task.uuid, { type, task });
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
