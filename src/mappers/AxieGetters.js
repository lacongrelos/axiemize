const getTotalParts = (parts = []) =>
  parts.reduce(
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

module.exports = {
  getTotalParts,
}
