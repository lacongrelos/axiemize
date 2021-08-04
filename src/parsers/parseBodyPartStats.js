const cheerio = require('cheerio')

const parseBodyParts = axieZoneContent => {
  const $ = cheerio.load(axieZoneContent)
  const axieBodyPartsDictionary = {}
  $('#pu_table tbody tr').each((i, axieZoneRowElement) => {
    const nodeRow = $(axieZoneRowElement)
    const href = nodeRow.find('td a').attr('href')
    const pvpPercentage = nodeRow.find('.percentage').text()
    let axieBodyPartName
    if (href) {
      axieBodyPartName = href.replace('/finder?search=part:', '')
    } else {
      const rowClasses = nodeRow.find('td.skill span').attr('class').split(/\s+/)
      axieBodyPartName = rowClasses[1]
    }
    axieBodyPartsDictionary[axieBodyPartName] = pvpPercentage
  })

  return axieBodyPartsDictionary
}

module.exports = parseBodyParts
