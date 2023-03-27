#!/usr/bin/env node
/**
 * task.json
 * Copyright (C) 2023 DCsunset
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/> 
 */

import { DateTime } from "luxon";
import { readStdin } from "./util.js";

const data = await readStdin();
const v1 = JSON.parse(data);
const v2 = [];

const allStatus = ["todo", "done", "removed"];
for (const status of allStatus) {
	for (const task of v1[status]) {
		task.status = status;
		task.created = task.start;
		task.done = task.end;

		delete task.start;
		delete task.end;

		v2.push(task);
	}
}

v2.sort((left, right) => {
	const leftDate = DateTime.fromISO(left.created);
	const rightDate = DateTime.fromISO(right.created);
	return leftDate < rightDate ? -1 : 1;
});

console.log(v2
	.map(task => JSON.stringify(task))
	.join("\n")
);
