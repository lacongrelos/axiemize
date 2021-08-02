const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const { AxieClasses, AxieParts, AxiePartNames, EmojiClasses } = require('./mappers/AxieElements')
const capitalize = require('./utils/capitalize')
const queryAxieDetail = require('./queries/queryAxieDetail')
const getAxiemizeDetail = require('./mappers/getAxiemizeDetail')
const { getTotalParts } = require('./mappers/AxieGetters')
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
        .option('axie from "pureness" until 6. Max: 6', {
          describe: 'axie min pureness',
          type: 'number',
        })
        .option('hp', {
          describe: 'axies min hp',
          type: 'number',
        })
        .option('speed', {
          describe: 'axies min speed',
          type: 'number',
        })
        .option('morale', {
          describe: 'axies min morale',
          type: 'number',
        })
        .option('skill', {
          describe: 'axies min skill',
          type: 'number',
        })
        .option('breedCount', {
          describe: 'axies from 0 until "breedCount". Max: 7',
          type: 'number',
        })
        .option('limit', {
          describe: 'result list limit',
          type: 'number',
        })
        .option('sort', {
          describe: 'extra sort option [totals|attack|defense]',
          type: 'string',
        })
        .example('scout market --classes Plants,Reptile')
        .example('scout market --classes p,r')
        .example('scout market --classes p,r --parts ba-shi')
    },
    handler: async ({ classes = '', parts = '', pureness, hp, morale, skill, speed, breedCount, limit, sort }) => {
      const parsedClasses = classes
        .split(',')
        .map(selectedClass => capitalize(selectedClass))
        .map(selectedClass => AxieClasses.find(axieClass => axieClass.startsWith(selectedClass)))
        .filter(axieClass => axieClass)
      const parsedParts = parts
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
        .map(regexPart =>
          AxieParts.find(axiePart => {
            return regexPart.test(axiePart)
          })
        )
        .filter(axiePart => axiePart)

      if (classes && !parsedClasses.length) {
        console.log(`Ups, classes ${classes} not found. Try again: ${AxieClasses.join(' | ')}`)
        return
      }

      if (parts && !parsedParts.length) {
        console.log(`Ups, parts ${parts} not found. Try again`)
        return
      }

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
        limit,
      })

      console.log(`Found ${gqlResponse.data.axies.total} axies`)
      let results = gqlResponse.data.axies.results.map(gqlAxieBrief => getAxiemizeDetail(gqlAxieBrief))
      if (sort) {
        const totalParts = gqlResponse.data.axies.results.map(({ id, parts: instanceParts }) => {
          return {
            id,
            ...getTotalParts(instanceParts),
          }
        })

        if (sort === 'totals') {
          totalParts.sort(
            (totalsA, totalsB) =>
              totalsB.attack + totalsB.defense + totalsB.energy - (totalsA.attack + totalsA.defense + totalsA.energy)
          )
        } else if (sort === 'attack') {
          totalParts.sort((totalsA, totalsB) => totalsB.attack - totalsA.attack)
        } else if (sort === 'defense') {
          totalParts.sort((totalsA, totalsB) => totalsB.defense - totalsA.defense)
        }

        results = totalParts.map(totals => results.find(axie => axie.id === totals.id))
      }
      console.table(results)
    },
  })

  .demandCommand()
  .help().argv
