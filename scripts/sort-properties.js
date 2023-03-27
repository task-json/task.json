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

import { readStdin } from "./util.js";
import { deserializeTaskJson, serializeTaskJson } from "task.json";

// Used to sort keys (based on order in specification)
const keyWeights = {
  id: 0,
  status: 1,
  text: 2,
  priority: 3,
  projects: 4,
  contexts: 5,
  deps: 6,
  due: 7,
  wait: 8,
  created: 9,
  modified: 10,
  done: 11
};

function weight(key) {
	// Custom keys have the largest weights
	return keyWeights[key] ?? 100;
}

const data = await readStdin();
const tj = deserializeTaskJson(data);
const tjSorted = tj.map(task => {
	const newTask = {};
	const keys = Object.keys(task).sort((l, r) => (
		weight(l) - weight(r)
	));
	for (const key of keys) {
		newTask[key] = task[key];
	}
	return newTask;
});

console.log(serializeTaskJson(tjSorted));
