# Todo.json

Todo.json is inspried by [todo.txt](https://github.com/todotxt/todo.txt).
It uses JSON format, which is widely used in programming and thus is extremely extensible and easy to read for programs.
The JSON format is also human-readable and can be edited directly.

The JSON format overcomes the problem in the strict rules of `todo.txt` that some fields might be lost in the completed task (e.g. priority).
It also provides more flexibility to add more fields for other applications.


## JSON format

A todo application mainly includes two files: `todo.json` and `done.json`.

Each JSON file includes an array of task objects,
whose fields are defined as follows:

| Field    | Type    | Required | Description |
| -------- | ------- | -------- | --------------- |
| text     | string  | Yes | The main description of a task |
| priority | boolean | no | Priority of a task (A-Z) |
| projects | string[] | no | Project tags |
| contexts | string[] | no | Context tags |
| due | string | no | Due date ("yyyy-MM-dd") |
| start | string | no | Start date of a task ("yyyy-MM-dd") |
| end | string | no | End date of a task ("yyyy-MM-dd") |

The format mainly follows the definition of `todo.txt`
but adds a new field for due date since it is widely used.

Besides, the `done` field is not used because the completed tasks are stored in anthor JSON file.

