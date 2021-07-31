const fetch = require('node-fetch')

const GRAPHQL_AXI_INFINITY = 'https://axieinfinity.com/graphql-server-v2/graphql'

const request = ({ query, variables }) => {
  return fetch(GRAPHQL_AXI_INFINITY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  }).then(r => r.json())
}

module.exports = request
