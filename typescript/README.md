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
import { Task, doTasks, mergeTaskJson } from "task.json";

let taskJson1: TaskJson[] = [];
let taskJson2: TaskJson[] = [];

const task: Task = {
  id: "fc18da07-9717-4199-8474-9bbc4c4c6cb5",
  text: "Hello, world!",
  modified: new Date().toISOString()
};

taskJson1.push(task);
taskJson1 = doTasks(taskJson1, ["fc18da07-9717-4199-8474-9bbc4c4c6cb5"]);
const taskJson3 = mergeTaskJson(taskJson1, taskJson2);
```


## Exported Functions

| Name          | Description                                |
| ------------- | ------------------------------------------ |
| priorityUrgency | Compute urgency based on priority  |
| createdUrgency | Compute priority based on created date |
| dueUrgency | Compute priority based on due date |
| taskUrgency   | Compute urgency based on all aspects |
| removeTasks   | Remove tasks by ids |
| eraseTasks    | Erase removed tasks by ids permanently |
| doTasks       | Finish todo tasks by ids |
| undoTasks     | Undo done or removed tasks by ids |
| indexTaskJson | Convert TaskJson to an indexed map (from id to task) |
| mergeTaskJson | Merge multiple TaskJson arrays |
| compareMergedTaskJson | Compare merged TaskJson with the original one            |
| getDepComponent | Get a task's connected component in dependency graph |
| getDepChildren | Get a task's dependant children (including indirect ones) |


All the functions return a new TaskJson array instead of mutating the original one.
This enables functional programming style to process the TaskJson array.

**Note**: `eraseTasks` is a dangerous operation.
It will permantly delete tasks and may break the merge procedure (used in synchronization).
Make sure the erased tasks are not in other TaskJson arrays if you want to merge them.

## License

All code licensed under AGPL-3.0. Full copyright notice:

    Copyright (C) 2020-2023  DCsunset

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

