function getObject (chunk, fromIndex) {
  const closingBraceIndex = chunk.indexOf('}', fromIndex)
  const event = chunk.slice(chunk.indexOf('{'), closingBraceIndex + 1)
  if (event) {
    try {
      // console.log('parsing', event)
      JSON.parse(event)
      return event
    } catch (err) {
      // console.log(`Failed: ${err.message}`)
      return getObject(chunk, closingBraceIndex + 1)
    }
  }
}

// let chunk = '{ "name": "start" }{ "name": "something", "data": {} }'
// let object = getObject(chunk)
// console.log(object)
// chunk = chunk.replace(object, '')
// console.log(chunk)
// object = getObject(chunk)
// console.log(object)
// chunk = chunk.replace(object, '')
// console.log(chunk)

exports.getObject = getObject
