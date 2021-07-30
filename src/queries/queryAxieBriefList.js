import request from '#axiemize/utils/request'

export const gql = `query GetAxieBriefList(
  $auctionType: AuctionType
  $criteria: AxieSearchCriteria
  $from: Int
  $sort: SortBy
  $size: Int
  $owner: String
) {
  axies(
    auctionType: $auctionType
    criteria: $criteria
    from: $from
    sort: $sort
    size: $size
    owner: $owner
  ) {
    total
    results {
      ...AxieBrief
      __typename
    }
    __typename
  }
}

fragment AxieBrief on Axie {
  id
  name
  stage
  class
  breedCount
  image
  title
  battleInfo {
    banned
    __typename
  }
  auction {
    ...AxieAuction
    __typename
  }
  parts {
    ...AxiePart
    __typename
  }
  stats {
    ...AxieStats
    __typename
  }
  __typename
}


fragment AxieAuction on Auction {
  startingPrice
  endingPrice
  startingTimestamp
  endingTimestamp
  duration
  timeLeft
  currentPrice
  currentPriceUSD
  suggestedPrice
  __typename
}

fragment AxiePart on AxiePart {
  id
  name
  class
  type
  abilities {
    ...AxieCardAbility
    __typename
  }
  __typename
}

fragment AxieCardAbility on AxieCardAbility {
  id
  name
  attack
  defense
  energy
  __typename
}

fragment AxieStats on AxieStats {
  hp
  speed
  skill
  morale
  __typename
}`

const range = min => [min >= 27 && min <= 61 ? min : 27, 61]

const queryAxieBriefList = ({ classes, parts, hp, morale, breedCount, pureness, skill, speed }) =>
  request({
    query: gql,
    variables: {
      from: 0,
      size: 50,
      sort: 'PriceAsc',
      auctionType: 'Sale',
      criteria: {
        classes: classes || [],
        parts: parts || [],
        hp: range(hp) || [],
        morale: range(morale) || [],
        breedCount: breedCount || null,
        pureness: pureness || null,
        skill: range(skill) || [],
        speed: range(speed) || [],
      },
    },
  })

export default queryAxieBriefList
