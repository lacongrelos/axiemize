const AxieBodyPartStats = require('./AxieBodyPartStats.json')
const AxieBodyPartClasses = require('./AxieBodyPartClasses.json')

const EmojiClasses = {
  Plant: '🍀',
  Reptile: '🦎',
  Beast: '🦁',
  Aquatic: '🐟',
  Bird: '🦅',
  Bug: '🐞',
  Dusk: '🌙',
  Mesk: '💠',
  Dawn: '✨',
}

const EmojiStats = {
  hp: '🔋',
  speed: '💨',
  skill: '💡',
  morale: '💢',
}

const AxieClasses = Object.keys(EmojiClasses)

const AxieBodyPartNames = Object.keys(AxieBodyPartClasses)

module.exports = {
  AxieClasses,
  AxieBodyPartNames,
  AxieBodyPartStats,
  AxieBodyPartClasses,
  EmojiClasses,
  EmojiStats,
}
