const fs = require('fs')
const csv = require('fast-csv')

const transformToDocs = require('./transform-data-to-docs')

/**
 * Input should be a single CSV row at a time. From one row we can transform a number of documents,
 * each of which will get serialised to JSON and written to the output stream.
 */
const onInputData = (outputStream, setPageStubs) => data =>
  transformToDocs(data, setPageStubs)
    .forEach(doc => outputStream.write(`${JSON.stringify(doc)}\n`))


const onInputFinish = outputStream => () => {
  console.log('Conversion finished.')

  if (outputStream !== process.stdout) {
    outputStream.end() // Not sure if neccessary
  }
}

function convert({
  input,
  output,
  maxVisits = 10,
  parsingOpts = {},
  imports: setPageStubs = false,
}) {
  const inputStream = input ? fs.createReadStream(input) : process.stdin
  const outputStream = output ? fs.createWriteStream(output) : process.stdout

  // Set up conversion stream
  const converterStream = csv(Object.assign({}, { headers: true, ignoreEmpty: true }, parsingOpts))
  converterStream.on('data', onInputData(outputStream, setPageStubs))
  converterStream.on('end', onInputFinish(outputStream))

  // Start piping the input file over the conversion stream
  inputStream.pipe(converterStream)
}

module.exports = convert
