# task.json

[![Version](https://img.shields.io/npm/v/task.json.svg)](https://npmjs.org/package/task.json)
[![License](https://img.shields.io/npm/l/task.json.svg)](https://github.com/DCsunset/task.json/blob/master/package.json)

Type definitions for task.json in TypeScript.

## Installation

```
npm install -D task.json
```


## Usage

```ts
import { Task, TaskJson } from "task.json";

const taskJson: TaskJson = {
  todo: [],
  done: [],
  removed: []
};

const task: Task = {
  uuid: "fc18da07-9717-4199-8474-9bbc4c4c6cb5",
  text: "Hello, world!",
  modified: new Date().toISOString()
};

taskJson.todo.push(task);
```


## License

GPL-3.0
