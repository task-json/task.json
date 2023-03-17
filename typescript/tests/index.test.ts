import {
	TaskJson,
	Task,
	TaskStatus,
	compareMergedTaskJson,
	mergeTaskJson,
	removeTasks,
	doTasks,
	undoTasks,
	getDepComponent,
	getDepChildren,
	eraseTasks,
	createdUrgency,
	priorityUrgency,
	dueUrgency,
	taskUrgency
} from "../src";
import { DateTime } from "luxon";


function expectTaskJson(tj: TaskJson, expected: { [st in TaskStatus]?: string[] }) {
	for (const [st, ids] of Object.entries<string[]>(expected)) {
		expect(tj.filter(t => t.status === st).map(t => t.id)).toEqual(ids);
	}
}

describe("Test task manipulations", () => {
	let tj: TaskJson = [
		{
			id: "1",
			status: "todo",
			text: "Hello, world 1",
			created: new Date("2000-01-01").toISOString(),
			modified: new Date("2010-07-07").toISOString(),
		},
		{
			id: "2",
			status: "todo",
			text: "Hello, world 2",
			created: new Date("2000-01-02").toISOString(),
			modified: new Date("2020-07-07").toISOString()
		},
		{
			id: "3",
			status: "todo",
			text: "Hello, world 3",
			deps: ["4", "5"],
			created: new Date("2000-01-03").toISOString(),
			modified: new Date("2010-07-07").toISOString()
		},
		{
			id: "4",
			status: "todo",
			text: "Hello, world 4",
			deps: ["5"],
			created: new Date("2000-01-04").toISOString(),
			modified: new Date("2020-07-07").toISOString()
		},
		{
			id: "5",
			status: "todo",
			text: "Hello, world 5",
			created: new Date("2000-01-04").toISOString(),
			modified: new Date("2020-07-07").toISOString()
		},
	]

	test("doTasks", () => {
		tj = doTasks(tj, ["1"]);
		expectTaskJson(tj, {
			todo: ["2", "3", "4", "5"],
			done: ["1"]
		});

		tj = doTasks(tj, ["2", "4"]);
		expectTaskJson(tj, {
			todo: ["3", "5"],
			done: ["1", "2", "4"]
		});
	});

	test("undoTasks", () => {
		tj = undoTasks(tj, ["1"]);
		expectTaskJson(tj, {
			todo: ["1", "3", "5"],
			done: ["2", "4"]
		});

		tj = undoTasks(tj, ["2"]);
		expectTaskJson(tj, {
			todo: ["1", "2", "3", "5"],
			done: ["4"]
		});
	});

	test("removeTasks", () => {
		tj = removeTasks(tj, ["1"]);
		expectTaskJson(tj, {
			todo: ["2", "3", "5"],
			done: ["4"],
			removed: ["1"]
		});

		tj = removeTasks(tj, ["1", "4"]);
		expectTaskJson(tj, {
			todo: ["2", "3", "5"],
			done: [],
			removed: ["1", "4"]
		});
	});

	test("undoTasks", () => {
		tj = undoTasks(tj, ["1", "4"]);
		expectTaskJson(tj, {
			todo: ["1", "2", "3", "5"],
			done: ["4"],
			removed: []
		});
	});

	test("eraseTasks", () => {
		tj = eraseTasks(tj, ["5"]);
		expectTaskJson(tj, {
			todo: ["1", "2", "3"],
			done: ["4"],
			removed: []
		});
		expect(tj.filter(t => t.id === "3")[0].deps).toEqual(["4"]);
		expect(tj.filter(t => t.id === "4")[0].deps).toBe(undefined);
	});
});


describe("Test Urgency", () => {
	const task1: Task = {
		id: "1",
		status: "todo",
		text: "",
		created: DateTime.local().plus({ days: -20 }).toISO(),
		modified: new Date("2121-10-20").toISOString(),
		due: DateTime.local().plus({ days: -1 }).toISO()
	};
	const task2: Task = {
		id: "2",
		status: "todo",
		text: "",
		priority: "C",
		created: DateTime.local().plus({ days: -10 }).toISO(),
		modified: new Date("2121-10-20").toISOString(),
		due: DateTime.local().plus({ days: 4 }).toISO()
	};
	const task3: Task = {
		id: "3",
		status: "todo",
		priority: "A",
		text: "",
		created: DateTime.local().plus({ days: -1 }).toISO(),
		modified: new Date("2121-10-20").toISOString(),
		due: DateTime.local().plus({ days: 20 }).toISO()
	};
	const task4: Task = {
		id: "3",
		status: "done",
		priority: "A",
		text: "",
		created: DateTime.local().plus({ days: -1 }).toISO(),
		modified: new Date("2121-10-20").toISOString(),
		due: DateTime.local().plus({ days: 20 }).toISO()
	};


	test("created urgency", () => {
		const urg1 = createdUrgency(task1.created);
		const urg2 = createdUrgency(task2.created);
		const urg3 = createdUrgency(task3.created);
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
		const urg4 = taskUrgency(task4);
		expect(urg1).toBeGreaterThan(urg2);
		expect(urg2).toBeGreaterThan(urg3);
		expect(urg4).toBe(0);
	});
});


describe("Test mergeTaskJson", () => {
	test("Without intersection", () => {
		const tj1: TaskJson = [];
		const tj2: TaskJson = [
			{
				id: "1",
				status: "todo",
				text: "Hello, world 1",
				created: new Date("2000-01-01").toISOString(),
				modified: new Date("2010-07-07").toISOString(),
			},
			{
				id: "2",
				status: "todo",
				text: "Hello, world 2",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		];
		const tj3: TaskJson = [
			{
				id: "3",
				status: "todo",
				text: "Hello, world 3",
				created: new Date("2000-01-03").toISOString(),
				modified: new Date("2010-07-07").toISOString()
			},
			{
				id: "4",
				status: "done",
				text: "Hello, world 4",
				created: new Date("2000-01-04").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		];

		expect(mergeTaskJson(tj1, tj2)).toEqual(tj2);
		expect(mergeTaskJson(tj3, tj1)).toEqual(tj3);
		expect(mergeTaskJson(tj1, tj3, tj2)).toEqual([
			{
				id: "1",
				status: "todo",
				text: "Hello, world 1",
				created: new Date("2000-01-01").toISOString(),
				modified: new Date("2010-07-07").toISOString()
			},
			{
				id: "2",
				status: "todo",
				text: "Hello, world 2",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "3",
				status: "todo",
				text: "Hello, world 3",
				created: new Date("2000-01-03").toISOString(),
				modified: new Date("2010-07-07").toISOString()
			},
			{
				id: "4",
				status: "done",
				text: "Hello, world 4",
				created: new Date("2000-01-04").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		]);
	});

	test("With intersection", () => {
		const tj1: TaskJson = [
			{
				id: "1",
				status: "todo",
				text: "Hello, world 1",
				created: new Date("2000-01-01").toISOString(),
				modified: new Date("2010-07-07").toISOString(),
			},
			{
				id: "2",
				status: "todo",
				text: "Hello, world 2",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		];
		const tj2: TaskJson = [
			{
				id: "1",
				status: "todo",
				text: "Hello, world 1 modified",
				created: new Date("2000-01-01").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "4",
				status: "done",
				text: "Hello, world 4",
				created: new Date("2000-01-04").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		];

		expect(mergeTaskJson(tj1, tj2, tj2)).toEqual(mergeTaskJson(tj1, tj1, tj2));
		expect(mergeTaskJson(tj2, tj2, tj2)).toEqual(tj2);
		expect(mergeTaskJson(tj2, tj1)).toEqual([
			{
				id: "1",
				status: "todo",
				text: "Hello, world 1 modified",
				created: new Date("2000-01-01").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "2",
				status: "todo",
				text: "Hello, world 2",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "4",
				status: "done",
				text: "Hello, world 4",
				created: new Date("2000-01-04").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		]);
	});
});


describe("Test compareMergedTaskJson", () => {
	test("Mixed merge", () => {
		const tj1: TaskJson = [
			{
				id: "1",
				status: "todo",
				text: "Hello, world 1",
				created: new Date("2000-01-01").toISOString(),
				modified: new Date("2010-07-07").toISOString(),
			},
			{
				id: "2",
				status: "todo",
				text: "Hello, world 2",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "3",
				status: "todo",
				text: "Hello, world 3",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		];

		// merged
		const tj2: TaskJson = [
			{
				id: "1",
				status: "todo",
				text: "Hello, world 1 modified",
				created: new Date("2000-01-01").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "2",
				status: "todo",
				text: "Hello, world 2",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-08").toISOString()
			},
			{
				id: "4",
				status: "done",
				text: "Hello, world 4",
				created: new Date("2000-01-04").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "3",
				status: "removed",
				text: "Hello, world 3",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-08").toISOString()
			}
		];

		expect(compareMergedTaskJson(tj1, tj2)).toEqual({
			created: 1,
			modified: 2,
			removed: 1,
			restored: 0
		});
	});
});


describe("Test Component", () => {
	test("getDepComponent", () => {
		const tj: TaskJson = [
			{
				id: "1",
				status: "todo",
				text: "Hello, world 1",
				deps: ["2"],
				created: new Date("2000-01-01").toISOString(),
				modified: new Date("2010-07-07").toISOString(),
			},
			{
				id: "2",
				status: "todo",
				text: "Hello, world 2",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "3",
				status: "todo",
				text: "Hello, world 3",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "4",
				status: "todo",
				text: "Hello, world 3",
				deps: ["2"],
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		];

		expect(getDepComponent(tj, ["2"]).sort())
			.toEqual(["1", "2", "4"]);
		expect(getDepComponent(tj, ["3"]))
			.toEqual(["3"]);
	});

	test("getDepChildren", () => {
		const tj: TaskJson = [
			{
				id: "1",
				status: "todo",
				text: "Hello, world 1",
				deps: ["4", "5"],
				created: new Date("2000-01-01").toISOString(),
				modified: new Date("2010-07-07").toISOString(),
			},
			{
				id: "2",
				status: "todo",
				text: "Hello, world 2",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "3",
				status: "todo",
				text: "Hello, world 3",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "4",
				status: "todo",
				text: "Hello, world 4",
				deps: ["2"],
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				id: "5",
				status: "todo",
				text: "Hello, world 5",
				created: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		];

		expect(getDepChildren(tj, ["1", "2"]).sort())
			.toEqual(["1", "2", "4"]);
		expect(getDepChildren(tj, ["4", "5"]).sort())
			.toEqual(["1", "4", "5"]);
	});
});

