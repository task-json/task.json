/*
 * Generated type guards for "index.d.ts".
 * WARNING: Do not manually change this file.
 */
import { Task, TaskJson } from "../index";

function evaluate(
    isCorrect: boolean,
    varName: string,
    expected: string,
    actual: any
): boolean {
    if (!isCorrect) {
        throw new Error(
            `${varName} type mismatch, expected: ${expected}, found: ${actual}`
        )
    }
    return isCorrect
}

export function isTask(obj: any, argumentName: string = "task"): obj is Task {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        evaluate(typeof obj.uuid === "string", `${argumentName}.uuid`, "string", obj.uuid) &&
        evaluate(typeof obj.text === "string", `${argumentName}.text`, "string", obj.text) &&
        evaluate((typeof obj.priority === "undefined" ||
            typeof obj.priority === "string"), `${argumentName}.priority`, "string | undefined", obj.priority) &&
        evaluate((typeof obj.projects === "undefined" ||
            Array.isArray(obj.projects) &&
            obj.projects.every((e: any) =>
                typeof e === "string"
            )), `${argumentName}.projects`, "string[] | undefined", obj.projects) &&
        evaluate((typeof obj.contexts === "undefined" ||
            Array.isArray(obj.contexts) &&
            obj.contexts.every((e: any) =>
                typeof e === "string"
            )), `${argumentName}.contexts`, "string[] | undefined", obj.contexts) &&
        evaluate((typeof obj.due === "undefined" ||
            typeof obj.due === "string"), `${argumentName}.due`, "string | undefined", obj.due) &&
        evaluate(typeof obj.start === "string", `${argumentName}.start`, "string", obj.start) &&
        evaluate((typeof obj.end === "undefined" ||
            typeof obj.end === "string"), `${argumentName}.end`, "string | undefined", obj.end) &&
        evaluate(typeof obj.modified === "string", `${argumentName}.modified`, "string", obj.modified)
    )
}

export function isTaskJson(obj: any, argumentName: string = "taskJson"): obj is TaskJson {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        evaluate(Array.isArray(obj.todo) &&
            obj.todo.every((e: any) =>
                isTask(e) as boolean
            ), `${argumentName}.todo`, "import(\"/home/luna/files/repository/task.json/typescript/index\").Task[]", obj.todo) &&
        evaluate(Array.isArray(obj.done) &&
            obj.done.every((e: any) =>
                isTask(e) as boolean
            ), `${argumentName}.done`, "import(\"/home/luna/files/repository/task.json/typescript/index\").Task[]", obj.done) &&
        evaluate(Array.isArray(obj.removed) &&
            obj.removed.every((e: any) =>
                isTask(e) as boolean
            ), `${argumentName}.removed`, "import(\"/home/luna/files/repository/task.json/typescript/index\").Task[]", obj.removed)
    )
}
