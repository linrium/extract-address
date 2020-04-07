import {extractParts} from '../index'
import addresses from './addresses.json'

describe('Test', () => {
  test.each(addresses)('test %s', (original, expected) => {
    const result = extractParts(original)
    expect(result.format()).toBe(expected)
  })
})