/*
 * Generated type guards for "index.d.ts".
 * WARNING: Do not manually change this file.
 */
import { Task, TaskJson } from "../index";

export function isTask(obj: any, _argumentName?: string): obj is Task {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        typeof obj.id === "string" &&
        typeof obj.text === "string" &&
        (typeof obj.priority === "undefined" ||
            typeof obj.priority === "string") &&
        (typeof obj.projects === "undefined" ||
            Array.isArray(obj.projects) &&
            obj.projects.every((e: any) =>
                typeof e === "string"
            )) &&
        (typeof obj.contexts === "undefined" ||
            Array.isArray(obj.contexts) &&
            obj.contexts.every((e: any) =>
                typeof e === "string"
            )) &&
        (typeof obj.due === "undefined" ||
            typeof obj.due === "string") &&
        typeof obj.start === "string" &&
        (typeof obj.end === "undefined" ||
            typeof obj.end === "string") &&
        typeof obj.modified === "string"
    )
}

export function isTaskJson(obj: any, _argumentName?: string): obj is TaskJson {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        Array.isArray(obj.todo) &&
        obj.todo.every((e: any) =>
            isTask(e) as boolean
        ) &&
        Array.isArray(obj.done) &&
        obj.done.every((e: any) =>
            isTask(e) as boolean
        ) &&
        Array.isArray(obj.removed) &&
        obj.removed.every((e: any) =>
            isTask(e) as boolean
        )
    )
}
