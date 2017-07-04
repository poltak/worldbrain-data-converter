# worldbrain-data-converter

Convert from a CSV containing page data to WorldBrain web extension compatible JSON data. The JSON data
can be imported into the PouchDB via the web extension's user interface.

## Installation

With yarn:

```bash
$ yarn global add worldbrain-data-converter
```

or with NPM:

```bash
$ npm i -g worldbrain-data-converter
```

## Usage

To convert a CSV containing relevant page data fields:

```bash
$ worldbrain-data-converter -i /path/to/file.csv -o /path/to/output.txt
```

Or simply redirect IO files on stdout/stdin:

```bash
$ worldbrain-data-converter < /path/to/file.csv > /path/to/output.txt
```

Outputting to 50MB batches named: `output_aa`, `output_ab`, etc:

```bash
$ worldbrain-data-converter < /path/to/file.csv | split -b 50m - output_
```

Full options:

```
$ worldbrain-data-converter --help
Usage: worldbrain-data-converter

  -o, --output=ARG          name of output file (default: stdout)
  -i, --input=ARG           name of input CSV file (default: stdin)
  -v, --maxVisits=ARG       max number of visit docs to generate per page (default: 10)
  -b, --bookmarkChance=ARG  percentage chance that a bookmark doc will be created for input row (default: 1)
  -s, --imports             schedule converted docs for imports for later filling out
  -h, --help                display this help
```

## Details on input format

Should be a CSV containing columns `url`, `title`, and `body`. From each row in the CSV, the following WorldBrain data will be produced:

- 1 page doc
- 0-`maxVisits` visit docs
- 0-1 bookmark docs (change to generate specified via `bookmarkChance`)

`body` is the page text content.

_Maybe later have the option of being able to accept other fields, or miss them out (only `url` really matters)._

## Details on output format

Should be a new-line delimited JSON file, which each line containing one JSON object representing
a document in the web extension's PouchDB. Data will be derived from input file and also generated
for unavailable fields.

The following data is generated:

- `_id` for all doc types
- `content.keywords` for page docs
- `content.description` for page docs

_Maybe will have a flag to disable data generation of these, and add support in the input file format._

### Split output for importing into extension

As the extension is currently running entirely within the browser, things like memory management with file IO
are painful. It's recommended to pipe the output of this script to something like [`split`](https://en.wikipedia.org/wiki/Split_(Unix)) to split up the output files.

Example:

```bash
$ worldbrain-data-converter < /path/to/file.csv | split -b 50m - ${OUTPUT_FILE_PREFIX}
```
