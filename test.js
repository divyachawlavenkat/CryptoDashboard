require('jest-extended')
require('jest-chain')
const CoinMarketCap = require('./')

require('dotenv').config()

const API_KEY = process.env.COINMARKETCAP_API_KEY

test('should be defined', () => {
  expect(CoinMarketCap).toBeDefined()
})

test('should return new CoinMarketCap client', () => {
  const client = new CoinMarketCap(API_KEY)
  expect(client.getTickers).toBeDefined()
  expect(client.getGlobal).toBeDefined()
  expect(client.getQuotes).toBeDefined()
  expect(client.getIdMap).toBeDefined()
  expect(client.getMetadata).toBeDefined()
})

test('getTickers should have correct response structure and type', async () => {
  const client = new CoinMarketCap(API_KEY)
  const ticker = await client.getTickers()
  expect(ticker).toContainAllKeys(['data', 'status'])
  expect(ticker).toHaveProperty('status.timestamp')
  expect(ticker).toHaveProperty('status.credit_count')
  expect(ticker).toHaveProperty('status.error_code')
  expect(ticker.data).toBeArray()
  expect(ticker.status.timestamp).toBeString()
})

test('should get latest tickers', async () => {
  const client = new CoinMarketCap(API_KEY)
  const ticker1 = await client.getTickers()
  const ticker2 = await client.getTickers({ limit: 10 })

  expect(typeof ticker1).toBe('object')
  expect(typeof ticker2).toBe('object')
  expect(Object.keys(ticker2.data).length).toBe(10)
})

test('should get latest global', async () => {
  const client = new CoinMarketCap(API_KEY)
  const global = await client.getGlobal()

  expect(typeof global).toBe('object')
  expect(global).toContainAllKeys(['data', 'status'])
  expect(global).toHaveProperty('status.timestamp')
  expect(global).toHaveProperty('status.error_code')
  expect(global).toHaveProperty('data.active_cryptocurrencies')
  expect(global).toHaveProperty('data.quote')
  expect(global).toHaveProperty('data.active_market_pairs')
})

test('should get ID map', async () => {
  const client = new CoinMarketCap(API_KEY)
  const map = await client.getIdMap({ symbol: ['BTC', 'ETH'] })

  expect(typeof map).toBe('object')
  expect(map).toContainAllKeys(['data', 'status'])
  expect(map).toHaveProperty('status.timestamp')
  expect(map).toHaveProperty('status.error_code')
  expect(Array.isArray(map.data)).toBeTruthy()
  for (const info of map.data) {
    expect(typeof info).toBe('object')
    expect(info).toHaveProperty('id')
    expect(info).toHaveProperty('name')
    expect(info).toHaveProperty('symbol')
  }
})

test('should get quotes', async () => {
  const client = new CoinMarketCap(API_KEY)
  const quotes = await client.getQuotes({ symbol: ['BTC', 'ETH'] })
