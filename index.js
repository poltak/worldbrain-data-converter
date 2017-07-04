#! /usr/bin/env node
const Getopt = require('node-getopt')

const convert = require('./converter')

const CLI_ARGS = [
  ['o', 'output=ARG', 'name of output file (default: stdout)'],
  ['i', 'input=ARG', 'name of input CSV file (default: stdin)'],
  ['v', 'maxVisits=ARG', 'max number of visit docs to generate per page (default: 10)'],
  ['b', 'bookmarkChance=ARG', 'percentage chance that a bookmark doc will be created for input row (default: 1)'],
  ['s', 'imports', 'schedule converted docs for imports for later filling out'],
  ['h', 'help', 'display this help'],
]

const args = new Getopt(CLI_ARGS)
args.bindHelp()
const usage = () => {
  console.warn(args.getHelp())
  process.exit(1)
}


const { options } = args.parseSystem()

// Validate and parse CLI args
const bookmarkChance = options.bookmarkChance ? Number(options.bookmarkChance) : 1
if (isNaN(bookmarkChance) || bookmarkChance < 0 || bookmarkChance > 100) usage()

const maxVisits = options.maxVisits ? Number(options.maxVisits) : 10
if (isNaN(maxVisits) || maxVisits < 0) usage()

convert(Object.assign({}, options, { bookmarkChance, maxVisits }))
