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
| uuid | string | Yes | To identify a task |
| text     | string  | Yes | The main description of a task |
| priority | string | no | Priority of a task (A-Z) |
| projects | string[] | no | Project tags |
| contexts | string[] | no | Context tags |
| due | string | no | Due date (ISO 8601 format) |
| start | string | no | Start date of a task (ISO 8601 format) |
| end | string | no | End date of a task (ISO 8601 format) |
| modified | string | yes | Modified date of a task (ISO 8601 format) |

The format mainly follows the definition of `todo.txt`
but adds a new field for due date since it is widely used.

The `uuid` and `modified` fields are necessary for synchronization between multiple tasks.

## Related Projects

* [task.json-cli](https://github.com/DCsunset/task.json-cli): Command line task management app for task.json
