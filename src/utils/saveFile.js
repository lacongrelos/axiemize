const fs = require('fs')

const saveFile = (name, jsonContent) => {
  fs.writeFile(name, JSON.stringify(jsonContent), 'utf8', err => {
    if (err) {
      console.log('An error occured while writing JSON Object to File.')
      return console.log(err)
    }

    console.log(`${name} file has been saved.`)
    return true
  })
}

module.exports = saveFile
