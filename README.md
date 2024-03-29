# task.json

Task.json is inspired by [todo.txt](https://github.com/todotxt/todo.txt).
It uses JSON format, which is widely used in programming and thus extensible and easy to read for programs.
The JSON format can also be edited directly.

The JSON format overcomes the problem in the strict rules of `todo.txt` that some fields might be lost in the completed task (e.g. priority).
It also provides more flexibility to add custom fields for other applications.


## task.json format (v2)

task.json is a large multi-line string (usually stored in a file)
that consists of a number of tasks where each task is a single-line JSON string.
(note: there's a newline character after the last task).
Using single-line JSON for each task enables programs to append to a the file when a new task is added.
Besides, it works well with Linux command line tools like grep.

Fields for each task are defined as follows:

| Field    | Type     | Required | Description               |
| -------- | -------- | -------- | ------------------------- |
| id       | string   | yes      | Unique ID for a task      |
| status   | Status   | yes      | Status of current task    |
| text     | string   | yes      | The description of a task |
| priority | string   | no       | Priority of a task (A-Z)  |
| projects | string[] | no       | Project tags              |
| contexts | string[] | no       | Context tags              |
| deps     | string[] | no       | Dependencies              |
| due      | DateTime | no       | Due date                  |
| wait     | DateTime | no       | Date until task is shown  |
| created  | DateTime | yes      | Created date of a task    |
| modified | DateTime | yes      | Modified date of a task   |
| done     | DateTime | no       | Done date of a task       |

The `Status` type above can be one of the following string: `todo`, `done`, `removed`.

The `DateTime` type above represents a string in ISO 8601 format.
UUID is recommended for `id` but not mandatory.

The format mainly follows the definition of `todo.txt`
but adds some new fields for more features.

The `removed`, `id` and `modified` fields are necessary for synchronization between multiple tasks.

Generally, task.json can be treated as a list of JSON tasks.
It's usually parsed line by line and finally collected into a list.
It's recommended to sort tasks by created date but not required.


## Libraries

* [TypeScript](./typescript)

## Related Projects

* [task.json-cli](https://github.com/task-json/task.json-cli): Command line task management app for task.json
* [task.json-server](https://github.com/task-json/task.json-server): Server to store and sync task.json
* [task.json-client](https://github.com/task-json/task.json-client): Client library to interact with task.json-server
* [task.json-web](https://github.com/task-json/task.json-web): Web UI for task.json


## Acknowledgement

The logo is modified based on the icon credited to [Materidal Design Icons](https://pictogrammers.com/library/mdi/).

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
