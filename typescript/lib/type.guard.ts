/*
 * Generated type guards for "index.d.ts".
 * WARNING: Do not manually change this file.
 */
import { TaskJson } from "../index";

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

export function isTaskJson(obj: any, argumentName: string = "taskJson"): obj is TaskJson {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        evaluate(Array.isArray(obj.todo) &&
            obj.todo.every((e: any, i0: number) =>
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                evaluate(typeof e.uuid === "string", `${argumentName}.todo[${i0}].uuid`, "string", e.uuid) &&
                evaluate(typeof e.text === "string", `${argumentName}.todo[${i0}].text`, "string", e.text) &&
                evaluate((typeof e.priority === "undefined" ||
                    typeof e.priority === "string"), `${argumentName}.todo[${i0}].priority`, "string | undefined", e.priority) &&
                evaluate((typeof e.projects === "undefined" ||
                    Array.isArray(e.projects) &&
                    e.projects.every((e: any) =>
                        typeof e === "string"
                    )), `${argumentName}.todo[${i0}].projects`, "string[] | undefined", e.projects) &&
                evaluate((typeof e.contexts === "undefined" ||
                    Array.isArray(e.contexts) &&
                    e.contexts.every((e: any) =>
                        typeof e === "string"
                    )), `${argumentName}.todo[${i0}].contexts`, "string[] | undefined", e.contexts) &&
                evaluate((typeof e.due === "undefined" ||
                    typeof e.due === "string"), `${argumentName}.todo[${i0}].due`, "string | undefined", e.due) &&
                evaluate(typeof e.start === "string", `${argumentName}.todo[${i0}].start`, "string", e.start) &&
                evaluate((typeof e.end === "undefined" ||
                    typeof e.end === "string"), `${argumentName}.todo[${i0}].end`, "string | undefined", e.end) &&
                evaluate(typeof e.modified === "string", `${argumentName}.todo[${i0}].modified`, "string", e.modified)
            ), `${argumentName}.todo`, "import(\"/home/luna/files/repository/task.json/typescript/index\").Task[]", obj.todo) &&
        evaluate(Array.isArray(obj.done) &&
            obj.done.every((e: any, i0: number) =>
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                evaluate(typeof e.uuid === "string", `${argumentName}.done[${i0}].uuid`, "string", e.uuid) &&
                evaluate(typeof e.text === "string", `${argumentName}.done[${i0}].text`, "string", e.text) &&
                evaluate((typeof e.priority === "undefined" ||
                    typeof e.priority === "string"), `${argumentName}.done[${i0}].priority`, "string | undefined", e.priority) &&
                evaluate((typeof e.projects === "undefined" ||
                    Array.isArray(e.projects) &&
                    e.projects.every((e: any) =>
                        typeof e === "string"
                    )), `${argumentName}.done[${i0}].projects`, "string[] | undefined", e.projects) &&
                evaluate((typeof e.contexts === "undefined" ||
                    Array.isArray(e.contexts) &&
                    e.contexts.every((e: any) =>
                        typeof e === "string"
                    )), `${argumentName}.done[${i0}].contexts`, "string[] | undefined", e.contexts) &&
                evaluate((typeof e.due === "undefined" ||
                    typeof e.due === "string"), `${argumentName}.done[${i0}].due`, "string | undefined", e.due) &&
                evaluate(typeof e.start === "string", `${argumentName}.done[${i0}].start`, "string", e.start) &&
                evaluate((typeof e.end === "undefined" ||
                    typeof e.end === "string"), `${argumentName}.done[${i0}].end`, "string | undefined", e.end) &&
                evaluate(typeof e.modified === "string", `${argumentName}.done[${i0}].modified`, "string", e.modified)
            ), `${argumentName}.done`, "import(\"/home/luna/files/repository/task.json/typescript/index\").Task[]", obj.done) &&
        evaluate(Array.isArray(obj.removed) &&
            obj.removed.every((e: any, i0: number) =>
                (e !== null &&
                    typeof e === "object" ||
                    typeof e === "function") &&
                evaluate(typeof e.uuid === "string", `${argumentName}.removed[${i0}].uuid`, "string", e.uuid) &&
                evaluate(typeof e.text === "string", `${argumentName}.removed[${i0}].text`, "string", e.text) &&
                evaluate((typeof e.priority === "undefined" ||
                    typeof e.priority === "string"), `${argumentName}.removed[${i0}].priority`, "string | undefined", e.priority) &&
                evaluate((typeof e.projects === "undefined" ||
                    Array.isArray(e.projects) &&
                    e.projects.every((e: any) =>
                        typeof e === "string"
                    )), `${argumentName}.removed[${i0}].projects`, "string[] | undefined", e.projects) &&
                evaluate((typeof e.contexts === "undefined" ||
                    Array.isArray(e.contexts) &&
                    e.contexts.every((e: any) =>
                        typeof e === "string"
                    )), `${argumentName}.removed[${i0}].contexts`, "string[] | undefined", e.contexts) &&
                evaluate((typeof e.due === "undefined" ||
                    typeof e.due === "string"), `${argumentName}.removed[${i0}].due`, "string | undefined", e.due) &&
                evaluate(typeof e.start === "string", `${argumentName}.removed[${i0}].start`, "string", e.start) &&
                evaluate((typeof e.end === "undefined" ||
                    typeof e.end === "string"), `${argumentName}.removed[${i0}].end`, "string | undefined", e.end) &&
                evaluate(typeof e.modified === "string", `${argumentName}.removed[${i0}].modified`, "string", e.modified)
            ), `${argumentName}.removed`, "import(\"/home/luna/files/repository/task.json/typescript/index\").Task[]", obj.removed)
    )
}
