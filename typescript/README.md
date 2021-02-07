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
  uuid: "fc18da07-9717-4199-8474-9bbc4c4c6cb5",
  text: "Hello, world!",
  modified: new Date().toISOString()
};

taskJson1.todo.push(task);
const taskJson3 = mergeTaskJson(taskJson1, taskJson2);
```


## License

GPL-3.0
