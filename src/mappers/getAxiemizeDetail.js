import { EmojiClasses, EmojiStats } from '#axiemize/mappers/AxieElements'

const getPart = ({ class: group, abilities = [], name }) => {
  const description = abilities.length
    ? ` 🗡️ ${abilities[0].attack} 🛡️ ${abilities[0].defense} ⚡ ${abilities[0].energy}`
    : ''

  return `${EmojiClasses[group]}${description} ${name}`
}

const getTotalParts = (parts = []) => {
  const totals = parts.reduce(
    (acc, { abilities = [] }) => {
      if (abilities.length) {
        acc.attack += abilities[0].attack
        acc.defense += abilities[0].defense
        acc.energy += abilities[0].energy
      }
      return acc
    },
    { attack: 0, defense: 0, energy: 0 }
  )

  return `🗡️ ${totals.attack} 🛡️ ${totals.defense} ⚡ ${totals.energy}`
}

const getAxiemizeDetail = ({ class: group, id, breedCount, stats, auction, parts }) => {
  return {
    group: EmojiClasses[group],
    id,
    price: auction ? `${(auction.currentPrice / 10 ** 18).toFixed(2)}ETH (${auction.currentPriceUSD}USD)` : 'No Price',
    totals: getTotalParts(parts),
    breed: breedCount,
    stats: Object.keys(stats)
      .filter(stat => stat !== '__typename')
      .map(stat => `${EmojiStats[stat]} ${stats[stat]}`)
      .join(' '),
    back: getPart(parts[2]),
    mouth: getPart(parts[3]),
    horn: getPart(parts[4]),
    tail: getPart(parts[5]),
    eye: getPart(parts[0]),
    ear: getPart(parts[1]),
  }
}

export default getAxiemizeDetail
