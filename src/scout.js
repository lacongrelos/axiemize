const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const { AxieClasses, AxieParts, AxiePartNames, EmojiClasses } = require('./mappers/AxieElements')
const capitalize = require('./utils/capitalize')
const queryAxieDetail = require('./queries/queryAxieDetail')
const getAxiemizeDetail = require('./mappers/getAxiemizeDetail')
const queryAxieBriefList = require('./queries/queryAxieBriefList')

const simpleFormat = (type, ref) => (ref ? `${type}: ${ref}, ` : '')

const prettyFormat = (type, ref) => {
  if (type === 'classes') {
    return `Classes: ${ref.map(theClass => `${EmojiClasses[theClass]} ${theClass}`).join(',')}`
  }

  if (type === 'parts' && ref) {
    return `Parts: ${ref.map(thePart => `${EmojiClasses[AxiePartNames[thePart]]} ${thePart}`).join(',')}`
  }

  return simpleFormat(type, ref)
}

// eslint-disable-next-line no-unused-expressions
yargs(hideBin(process.argv))
  .usage('Unofficial axie infinity scout toolbox 🛠️')
  .command({
    command: 'profile <id>',
    aliases: ['get', 'axie'],
    desc: 'Get info about existing axie',
    builder: _args => {
      return _args.positional('id', {
        describe: 'Axie id',
        type: 'number',
      })
    },
    handler: async ({ id }) => {
      const gqlResponse = await queryAxieDetail({ id })
      console.table(getAxiemizeDetail(gqlResponse.data.axie))
    },
  })
  .example('scout profile 2345678')
  .check(({ id }) => {
    if (Number.isNaN(id)) {
      return 'Enter a valid axie identifier'
    }
    return true
  })
  .command({
    command: 'market',
    desc: 'Find axies in the marketplace',
    builder: _args => {
      return _args
        .option('classes', {
          describe: 'axie class',
          type: 'string',
          require: true,
        })
        .option('parts', {
          describe: 'axie parts',
          type: 'string',
        })
        .option('pureness', {
          describe: 'axie min pureness',
          type: 'number',
        })
        .option('hp', {
          describe: 'axie min hp',
          type: 'number',
        })
        .option('speed', {
          describe: 'axie min speed',
          type: 'number',
        })
        .option('morale', {
          describe: 'axie min morale',
          type: 'number',
        })
        .option('skill', {
          describe: 'axie min skill',
          type: 'number',
        })
        .option('breedCount', {
          describe: 'axie min breed',
          type: 'number',
        })
        .example('scout market --classes Plants,Reptile')
        .example('scout market --classes p,r')
        .example('scout market --classes p,r --parts ba-shi')
    },
    handler: async ({ classes = '', parts = '', pureness, hp, morale, skill, speed, breedCount }) => {
      const parsedClasses = classes
        .split(',')
        .map(selectedClass => capitalize(selectedClass))
        .map(selectedClass => AxieClasses.find(axieClass => axieClass.startsWith(selectedClass)))

      const parsedParts = parts
        ? parts
            .split(',')
            .map(
              part =>
                new RegExp(
                  part
                    .split('-')
                    .map(el => `(${el})\\w*`)
                    .join('\\-')
                )
            )
            .map(regexPart => AxieParts.find(axiePart => regexPart.test(axiePart)))
        : undefined

      console.log(
        `fetching axies from marketplace. Query based on ${[
          ['classes', parsedClasses],
          ['parts', parsedParts],
          ['hp', hp],
          ['speed', speed],
          ['skill', skill],
          ['morale', morale],
          ['breedCount', breedCount],
          ['pureness', pureness],
        ].map(tupla => prettyFormat(...tupla))}`
      )

      const gqlResponse = await queryAxieBriefList({
        classes: parsedClasses,
        parts: parsedParts,
        pureness,
        hp,
        morale,
        skill,
        speed,
        breedCount,
      })

      console.log(`Found ${gqlResponse.data.axies.total} axies`)
      console.table(gqlResponse.data.axies.results.map(gqlAxieBrief => getAxiemizeDetail(gqlAxieBrief)))
    },
  })

  .demandCommand()
  .help().argv
