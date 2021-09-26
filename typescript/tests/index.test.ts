import { TaskJson, Task } from "index";
import {
	compareMergedTaskJson,
	mergeTaskJson,
	initTaskJson,
	isTask,
	isTaskJson,
	removeTasks,
	doTasks,
	undoTasks,
	idToIndex,
	getDepComponent,
	getDepChildren,
	eraseTasks,
	startUrgency,
	priorityUrgency,
	dueUrgency,
	taskUrgency
} from "../lib";
import { DateTime } from "luxon";

describe("Test task manipulations", () => {
	const tj: TaskJson = {
		todo: [
			{
				id: "1",
				text: "Hello, world 1",
				start: new Date("2000-01-01").toISOString(),
				modified: new Date("2010-07-07").toISOString(),
			},
			{
				id: "2",
				text: "Hello, world 2",
				start: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "3",
				text: "Hello, world 3",
				deps: ["4", "5"],
				start: new Date("2000-01-03").toISOString(),
				modified: new Date("2010-07-07").toISOString()
			},
			{
				id: "4",
				text: "Hello, world 4",
				deps: ["5"],
				start: new Date("2000-01-04").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "5",
				text: "Hello, world 5",
				start: new Date("2000-01-04").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
		],
		done: [],
		removed: []
	};

	test("doTasks", () => {
		// todo: [1, 2, 3, 4, 5]
		doTasks(tj, [0]);
		expect(tj.done.length).toBe(1);
		expect(tj.todo.length).toBe(4);
		expect(tj.done[0].id).toEqual("1");

		doTasks(tj, [0, 2]);
		expect(tj.done.length).toBe(3);
		expect(tj.todo.length).toBe(2);
		expect(tj.done[1].id).toEqual("2");
		expect(tj.done[2].id).toEqual("4");
	});

	test("undoTasks", () => {
		// todo: [3, 5], done: [1, 2, 4]
		undoTasks(tj, "done", [0]);
		expect(tj.todo.length).toBe(3);
		expect(tj.done.length).toBe(2);
		expect(tj.todo[2].id).toEqual("1");

		undoTasks(tj, "done", [0]);
		expect(tj.todo.length).toBe(4);
		expect(tj.done.length).toBe(1);
		expect(tj.todo[3].id).toEqual("2");
	});

	test("removeTasks", () => {
		// todo: [3, 5, 1, 2], done: [4]
		removeTasks(tj, "done", [0]);
		expect(tj.done.length).toBe(0);
		expect(tj.removed.length).toBe(1);
		expect(tj.removed[0].id).toEqual("4");

		removeTasks(tj, "todo", [0]);
		expect(tj.todo.length).toBe(3);
		expect(tj.removed.length).toBe(2);
		expect(tj.removed[1].id).toEqual("3");
	});

	test("undoTasks", () => {
		// todo: [5, 1, 2], done: [], removed: [4, 3]
		undoTasks(tj, "removed", [0, 1]);
		expect(tj.todo.length).toBe(4);
		expect(tj.done.length).toBe(1);
		expect(tj.removed.length).toBe(0);
		expect(tj.todo[3].id).toEqual("3");
		expect(tj.done[0].id).toEqual("4");
	});

	test("eraseTasks", () => {
		// todo: [5, 1, 2, 3], done: [4], removed: []
		removeTasks(tj, "todo", [0])
		eraseTasks(tj, [0]);
		expect(tj.todo[2].deps).toEqual(["4"]);
		expect(tj.done[0].deps).toBe(undefined);
	});

	test("idToIndex", () => {
		// todo: [1, 2, 3], done: [4], removed: []
		expect(
			idToIndex(tj, "todo", ["1", "3"])
		).toEqual([0, 2]);
	});
});

describe("Test Urgency", () => {
	const task1: Task = {
		id: "1",
		text: "",
		start: DateTime.local().plus({ days: -20 }).toISO(),
		modified: new Date("2121-10-20").toISOString(),
		due: DateTime.local().plus({ days: -1 }).toISO()
	};
	const task2: Task = {
		id: "2",
		text: "",
		priority: "C",
		start: DateTime.local().plus({ days: -10 }).toISO(),
		modified: new Date("2121-10-20").toISOString(),
		due: DateTime.local().plus({ days: 4 }).toISO()
	};
	const task3: Task = {
		id: "3",
		priority: "A",
		text: "",
		start: DateTime.local().plus({ days: -1 }).toISO(),
		modified: new Date("2121-10-20").toISOString(),
		due: DateTime.local().plus({ days: 20 }).toISO()
	};

	test("start urgency", () => {
		const urg1 = startUrgency(task1.start);
		const urg2 = startUrgency(task2.start);
		const urg3 = startUrgency(task3.start);
		expect(urg1).toBeGreaterThan(urg2);
		expect(urg2).toBeGreaterThan(urg3);
	});

	test("priority urgency", () => {
		const urg2 = priorityUrgency(task2.priority!);
		const urg3 = priorityUrgency(task3.priority!);
		expect(urg2).toBeLessThan(urg3);
	});

	test("due urgency", () => {
		const urg1 = dueUrgency(task1.due!);
		const urg2 = dueUrgency(task2.due!);
		const urg3 = dueUrgency(task3.due!);
		expect(urg1).toBeGreaterThan(urg2);
		expect(urg2).toBeGreaterThan(urg3);
	});

	test("task urgency", () => {
		const urg1 = taskUrgency(task1);
		const urg2 = taskUrgency(task2);
		const urg3 = taskUrgency(task3);
		expect(urg1).toBeGreaterThan(urg2);
		expect(urg2).toBeGreaterThan(urg3);
	});
});

describe("Test mergeTaskJson", () => {
	test("Without intersection", () => {
		const tj1 = initTaskJson();
		const tj2: TaskJson = {
			todo: [
				{
					id: "1",
					text: "Hello, world 1",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2010-07-07").toISOString(),
				},
				{
					id: "2",
					text: "Hello, world 2",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			done: [],
			removed: []
		};
		const tj3: TaskJson = {
			todo: [
				{
					id: "3",
					text: "Hello, world 3",
					start: new Date("2000-01-03").toISOString(),
					modified: new Date("2010-07-07").toISOString()
				}
			],
			done: [
				{
					id: "4",
					text: "Hello, world 4",
					start: new Date("2000-01-04").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			removed: []
		};

		expect(mergeTaskJson(tj1, tj2)).toEqual(tj2);
		expect(mergeTaskJson(tj3, tj1)).toEqual(tj3);
		expect(mergeTaskJson(tj1, tj3, tj2)).toEqual({
			todo: [
				{
					id: "1",
					text: "Hello, world 1",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2010-07-07").toISOString()
				},
				{
					id: "2",
					text: "Hello, world 2",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					id: "3",
					text: "Hello, world 3",
					start: new Date("2000-01-03").toISOString(),
					modified: new Date("2010-07-07").toISOString()
				}
			],
			done: [
				{
					id: "4",
					text: "Hello, world 4",
					start: new Date("2000-01-04").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			removed: []
		});
	});

	test("With intersection", () => {
		const tj1: TaskJson = {
			todo: [
				{
					id: "1",
					text: "Hello, world 1",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2010-07-07").toISOString(),
				},
				{
					id: "2",
					text: "Hello, world 2",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			done: [],
			removed: []
		};
		const tj2: TaskJson = {
			todo: [
				{
					id: "1",
					text: "Hello, world 1 modified",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			done: [
				{
					id: "4",
					text: "Hello, world 4",
					start: new Date("2000-01-04").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			removed: []
		};

		expect(mergeTaskJson(tj1, tj2, tj2)).toEqual(mergeTaskJson(tj1, tj1, tj2));
		expect(mergeTaskJson(tj2, tj2, tj2)).toEqual(tj2);
		expect(mergeTaskJson(tj2, tj1)).toEqual({
			todo: [
				{
					id: "1",
					text: "Hello, world 1 modified",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					id: "2",
					text: "Hello, world 2",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			done: [
				{
					id: "4",
					text: "Hello, world 4",
					start: new Date("2000-01-04").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			removed: []
		});
	});
});

describe("Test compareMergedTaskJson", () => {
	test("Mixed merge", () => {
		const tj1: TaskJson = {
			todo: [
				{
					id: "1",
					text: "Hello, world 1",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2010-07-07").toISOString(),
				},
				{
					id: "2",
					text: "Hello, world 2",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					id: "3",
					text: "Hello, world 3",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			done: [],
			removed: []
		};

		// merged
		const tj2: TaskJson = {
			todo: [
				{
					id: "1",
					text: "Hello, world 1 modified",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					id: "2",
					text: "Hello, world 2",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-08").toISOString()
				}
			],
			done: [
				{
					id: "4",
					text: "Hello, world 4",
					start: new Date("2000-01-04").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			removed: [
				{
					id: "3",
					text: "Hello, world 3",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-08").toISOString()
				}
			]
		};

		expect(compareMergedTaskJson(tj1, tj2)).toEqual({
			created: 1,
			updated: 2,
			removed: 1,
			restored: 0
		});
	});
});

describe("Test Component", () => {
	test("getDepComponent", () => {
		const tj: TaskJson = {
			todo: [
				{
					id: "1",
					text: "Hello, world 1",
					deps: ["2"],
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2010-07-07").toISOString(),
				},
				{
					id: "2",
					text: "Hello, world 2",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					id: "3",
					text: "Hello, world 3",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					id: "4",
					text: "Hello, world 3",
					deps: ["2"],
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			done: [],
			removed: []
		};

		expect(getDepComponent(tj, ["2"]).sort())
			.toEqual(["1", "2", "4"]);
		expect(getDepComponent(tj, ["3"]))
			.toEqual(["3"]);
	});

	test("getDepChildren", () => {
		const tj: TaskJson = {
			todo: [
				{
					id: "1",
					text: "Hello, world 1",
					deps: ["4", "5"],
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2010-07-07").toISOString(),
				},
				{
					id: "2",
					text: "Hello, world 2",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					id: "3",
					text: "Hello, world 3",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					id: "4",
					text: "Hello, world 4",
					deps: ["2"],
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					id: "5",
					text: "Hello, world 5",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			done: [],
			removed: []
		};

		expect(getDepChildren(tj, ["1", "2"]).sort())
			.toEqual(["1", "2", "4"]);
		expect(getDepChildren(tj, ["4", "5"]).sort())
			.toEqual(["1", "4", "5"]);
	});
});

describe("Test type guards", () => {
	test("isTask", () => {
		expect(isTask({
			id: "4",
			text: "Hello, world 4",
			start: new Date("2000-01-04").toISOString(),
			modified: new Date("2020-07-07").toISOString()
		})).toEqual(true);

		expect(isTask({
			id: "4",
			text: "Hello, world 4",
			start: new Date("2000-01-04").toISOString(),
		})).toEqual(false);
	});

	test("isTaskJson", () => {
		expect(isTaskJson({
			todo: []
		})).toEqual(false);

		expect(isTaskJson(initTaskJson())).toEqual(true);
	});
});
