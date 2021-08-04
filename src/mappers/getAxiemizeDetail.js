const { EmojiClasses, EmojiStats, AxieBodyPartStats } = require('./AxieElements')
const { getTotalParts } = require('./AxieGetters')

const formatPart = ({ class: group, abilities = [], name, id }) => {
  const description = abilities.length
    ? ` 🗡️ ${abilities[0].attack} 🛡️ ${abilities[0].defense} ⚡ ${abilities[0].energy}`
    : ''

  return `${EmojiClasses[group]}${description} ${name} (${AxieBodyPartStats[id]})`
}

const formatTotalParts = (parts = []) => {
  const totals = getTotalParts(parts)
  return `🗡️ ${totals.attack} 🛡️ ${totals.defense} ⚡ ${totals.energy}`
}

const getAxiemizeDetail = ({ class: group, id, breedCount, stats, auction, parts }) => {
  return {
    group: EmojiClasses[group],
    id,
    price: auction ? `${(auction.currentPrice / 10 ** 18).toFixed(2)}ETH (${auction.currentPriceUSD}USD)` : 'No Price',
    totals: formatTotalParts(parts),
    breed: breedCount,
    stats: Object.keys(stats)
      .filter(stat => stat !== '__typename')
      .map(stat => `${EmojiStats[stat]} ${stats[stat]}`)
      .join(' '),
    back: formatPart(parts[2]),
    mouth: formatPart(parts[3]),
    horn: formatPart(parts[4]),
    tail: formatPart(parts[5]),
    eye: formatPart(parts[0]),
    ear: formatPart(parts[1]),
  }
}

module.exports = getAxiemizeDetail

exports.getTotalParts = getTotalParts
