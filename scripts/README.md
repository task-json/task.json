# task.json Scripts

TO use the scripts, first run `npm install` to isntall necessary modules.

## Migrate from v1 to v2

The script `migrate-v1-to-v2.js` accepts task.json v1 from stdin and output task.json v2 to stdout.
To migrate your old `task.json` file:

```sh
cat old-task.json | ./migrate-v1-to-v2.js > new-task.json
```

## Sort properties based on specification

To sort the properties in each task object (v2):

```sh
cat task.json | ./sort-properties.js > new-task.json
```

