# task.json

[![Version](https://img.shields.io/npm/v/task.json.svg)](https://npmjs.org/package/task.json)
[![License](https://img.shields.io/npm/l/task.json.svg)](https://github.com/DCsunset/task.json/blob/master/package.json)

Typescript library for task.json

## Installation

```
npm install task.json
```


## Usage

```ts
import { Task, mergeTaskJson, initTaskJson } from "task.json";

const taskJson1 = initTaskJson();
const taskJson2 = initTaskJson();

const task: Task = {
  id: "fc18da07-9717-4199-8474-9bbc4c4c6cb5",
  text: "Hello, world!",
  modified: new Date().toISOString()
};

taskJson1.todo.push(task);
const taskJson3 = mergeTaskJson(taskJson1, taskJson2);
```


## Exported Functions

| Name          | Description                                |
| ------------- | ------------------------------------------ |
| initTaskJson  | Create an empty TaskJson object            |
| taskUrgency   | Compute task urgency for sorting           |
| idToIndex     | Find indexes by ids                        |
| removeTasks   | Remove tasks by indexes                    |
| eraseTasks    | Erase removed tasks by indexes permanently |
| doTasks       | Finish todo tasks by indexes               |
| undoTasks     | Undo done or removed tasks by indexes      |
| indexTaskJson | Convert TaskJson to its indexed version    |
| deindexTaskJson | Convert indexed TaskJson to the normal one   |
| mergeTaskJson | Merge two TaskJson objects                 |
| compareMergedTaskJson | Compare merged TaskJson with the original one                 |

**Note**: `eraseTasks` is a dangerous operation.
It will permantly delete tasks and may break the merge procedure (used in synchronization).
Make sure the erased tasks are not in other TaskJson objects if you want to merge them.

## License

GPL-3.0

