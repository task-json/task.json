import { TaskJson } from "index";
import { mergeTaskJson, initTaskJson, isTask, isTaskJson } from "../lib";

describe("Test for function mergeTaskJson", () => {
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

	test("Type guard", () => {
		expect(isTask({
			uuid: "4",
			text: "Hello, world 4",
			start: new Date("2000-01-04").toISOString(),
			modified: new Date("2020-07-07").toISOString()
		})).toEqual(true);

		expect(() => isTask({
			uuid: "4",
			text: "Hello, world 4",
			start: new Date("2000-01-04").toISOString(),
		})).toThrow();

		expect(() => isTaskJson({
			todo: []
		})).toThrow();

		expect(isTaskJson(initTaskJson())).toEqual(true);
	});
});
