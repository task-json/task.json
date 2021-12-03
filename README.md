# Task.json

Task.json is inspired by [todo.txt](https://github.com/todotxt/todo.txt).
It uses JSON format, which is widely used in programming and thus is extremely extensible and easy to read for programs.
The JSON format is also human-readable and can be edited directly.

The JSON format overcomes the problem in the strict rules of `todo.txt` that some fields might be lost in the completed task (e.g. priority).
It also provides more flexibility to add more fields for other applications.


## JSON format

The JSON includes three fields: `todo`, `done`, `removed`.
Each part includes an array of task objects,
whose fields are defined as follows:

| Field    | Type     | Required | Description               |
| -------- | -------- | -------- | ------------------------- |
| id       | string   | yes      | Unique ID for a task      |
| text     | string   | yes      | The description of a task |
| priority | string   | no       | Priority of a task (A-Z)  |
| projects | string[] | no       | Project tags              |
| contexts | string[] | no       | Context tags              |
| deps     | string[] | no       | Dependencies              |
| due      | Date     | no       | Due date                  |
| wait     | Date     | no       | Date until task is shown  |
| start    | Date     | yes      | Created date of a task    |
| end      | Date     | no       | Done date of a task       |
| modified | Date     | yes      | Modified date of a task   |

The `Date` type above represents a string in ISO 8601 format.
UUID is recommended for `id` but not mandatory.

The format mainly follows the definition of `todo.txt`
but adds some new fields for more features.

The `removed`, `id` and `modified` fields are necessary for synchronization between multiple tasks.


## Libraries

* [TypeScript](./typescript)

## Related Projects

* [task.json-web](https://github.com/DCsunset/task.json-web): Web and Android UI for task.json
* [task.json-cli](https://github.com/DCsunset/task.json-cli): Command line task management app for task.json
* [task.json-server](https://github.com/DCsunset/task.json-server): Sync server for task.json
* [task.json-client](https://github.com/DCsunset/task.json-client): Libraries to interact with task.json-server
