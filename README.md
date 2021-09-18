# Task.json

Task.json is inspried by [todo.txt](https://github.com/todotxt/todo.txt).
It uses JSON format, which is widely used in programming and thus is extremely extensible and easy to read for programs.
The JSON format is also human-readable and can be edited directly.

The JSON format overcomes the problem in the strict rules of `todo.txt` that some fields might be lost in the completed task (e.g. priority).
It also provides more flexibility to add more fields for other applications.


## JSON format

The JSON includes three fields: `todo`, `done`, `removed`.
each part includes an array of task objects,
whose fields are defined as follows:

| Field    | Type    | Required | Description |
| -------- | ------- | -------- | --------------- |
| id | string | Yes | Unique ID for a task (uuid is recommended but others can also be used) |
| text     | string  | Yes | The main description of a task |
| priority | string | no | Priority of a task (A-Z) |
| projects | string[] | no | Project tags |
| contexts | string[] | no | Context tags |
| deps | string[] | no | Dependencies (IDs of other tasks) |
| due | string | no | Due date (ISO 8601 format) |
| start | string | yes | Created date of a task (ISO 8601 format) |
| end | string | no | Done date of a task (ISO 8601 format) |
| modified | string | yes | Modified date of a task (ISO 8601 format) |

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
