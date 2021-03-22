import { TaskJson } from "index";
import { mergeTaskJson, initTaskJson, isTask, isTaskJson, removeTasks, doTasks, undoTasks, uuidToIndex } from "../lib";

describe("Test task manipulations", () => {
	const tj: TaskJson = {
		todo: [
			{
				uuid: "1",
				text: "Hello, world 1",
				start: new Date("2000-01-01").toISOString(),
				modified: new Date("2010-07-07").toISOString(),
			},
			{
				uuid: "2",
				text: "Hello, world 2",
				start: new Date("2000-01-02").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			},
			{
				uuid: "3",
				text: "Hello, world 3",
				start: new Date("2000-01-03").toISOString(),
				modified: new Date("2010-07-07").toISOString()
			},
			{
				uuid: "4",
				text: "Hello, world 4",
				start: new Date("2000-01-04").toISOString(),
				modified: new Date("2020-07-07").toISOString()
			}
		],
		done: [],
		removed: []
	};

	test("doTasks", () => {
		// todo: [1, 2, 3, 4]
		doTasks(tj, [0]);
		expect(tj.done.length).toBe(1);
		expect(tj.todo.length).toBe(3);
		expect(tj.done[0].uuid).toEqual("1");

		doTasks(tj, [0, 2]);
		expect(tj.done.length).toBe(3);
		expect(tj.todo.length).toBe(1);
		expect(tj.done[1].uuid).toEqual("2");
		expect(tj.done[2].uuid).toEqual("4");
	});

	test("undoTasks", () => {
		// todo: [3], done: [1, 2, 4]
		undoTasks(tj, "done", [0]);
		expect(tj.todo.length).toBe(2);
		expect(tj.done.length).toBe(2);
		expect(tj.todo[1].uuid).toEqual("1");

		undoTasks(tj, "done", [0]);
		expect(tj.todo.length).toBe(3);
		expect(tj.done.length).toBe(1);
		expect(tj.todo[2].uuid).toEqual("2");
	});

	test("removeTasks", () => {
		// todo: [3, 1, 2], done: [4]
		removeTasks(tj, "done", [0]);
		expect(tj.done.length).toBe(0);
		expect(tj.removed.length).toBe(1);
		expect(tj.removed[0].uuid).toEqual("4");

		removeTasks(tj, "todo", [0]);
		expect(tj.todo.length).toBe(2);
		expect(tj.removed.length).toBe(2);
		expect(tj.removed[1].uuid).toEqual("3");
	});

	test("undoTasks", () => {
		// todo: [1, 2], done: [], removed: [4, 3]
		undoTasks(tj, "removed", [0, 1]);
		expect(tj.todo.length).toBe(3);
		expect(tj.done.length).toBe(1);
		expect(tj.removed.length).toBe(0);
		expect(tj.todo[2].uuid).toEqual("3");
		expect(tj.done[0].uuid).toEqual("4");
	});

	test("uuidToIndex", () => {
		// todo: [1, 2, 3], done: [4], removed: []
		expect(
			uuidToIndex(tj, "todo", ["1", "3"])
		).toEqual([0, 2]);
	});
});

describe("Test mergeTaskJson", () => {
	test("Without intersection", () => {
		const tj1 = initTaskJson();
		const tj2: TaskJson = {
			todo: [
				{
					uuid: "1",
					text: "Hello, world 1",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2010-07-07").toISOString(),
				},
				{
					uuid: "2",
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
					uuid: "3",
					text: "Hello, world 3",
					start: new Date("2000-01-03").toISOString(),
					modified: new Date("2010-07-07").toISOString()
				}
			],
			done: [
				{
					uuid: "4",
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
					uuid: "1",
					text: "Hello, world 1",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2010-07-07").toISOString()
				},
				{
					uuid: "2",
					text: "Hello, world 2",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					uuid: "3",
					text: "Hello, world 3",
					start: new Date("2000-01-03").toISOString(),
					modified: new Date("2010-07-07").toISOString()
				}
			],
			done: [
				{
					uuid: "4",
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
					uuid: "1",
					text: "Hello, world 1",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2010-07-07").toISOString(),
				},
				{
					uuid: "2",
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
					uuid: "1",
					text: "Hello, world 1 modified",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			done: [
				{
					uuid: "4",
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
					uuid: "1",
					text: "Hello, world 1 modified",
					start: new Date("2000-01-01").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				},
				{
					uuid: "2",
					text: "Hello, world 2",
					start: new Date("2000-01-02").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			done: [
				{
					uuid: "4",
					text: "Hello, world 4",
					start: new Date("2000-01-04").toISOString(),
					modified: new Date("2020-07-07").toISOString()
				}
			],
			removed: []
		});
	});
});

describe("Test type guards", () => {
	test("isTask", () => {
		expect(isTask({
			uuid: "4",
			text: "Hello, world 4",
			start: new Date("2000-01-04").toISOString(),
			modified: new Date("2020-07-07").toISOString()
		})).toEqual(true);

		expect(isTask({
			uuid: "4",
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
