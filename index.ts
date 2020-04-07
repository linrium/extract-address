import admin from './admin.json'
import _ from 'lodash/fp'
import removeAccents from './utils/remove-accents'

type Region = {
  name: string
  level: string
  counties: County[]
}

type County = {
  name: string
  level: string
  pattern: string
}

type ValueAdmin = Value & {
  county: County
  region: Region
}

type Value = {
  value: string
  index: number
}

type Address = {
  raw: string
  value: string
  index: number
  lastIndex: number
  county: County
  region: Region
  number: Value
}

const getAdmin = (address: string): ValueAdmin | null => {
  for (const region of admin) {
    const counties = region.counties

    for (const county of counties) {
      const pattern = county.pattern

      const matching = new RegExp(pattern, 'gi').exec(address)

      if (matching) {
        return {
          value: matching[0],
          index: matching.index,
          county,
          region,
        }
      }
    }
  }

  return null
}

const getPhoneNumber = (str: string): Value | null => {
  const phoneRe = /0(9[0-9]|3[2-9]|8[1-9]|7[0|6-9]|5[6-9])+([0-9]{7})\b/
  const result = phoneRe.exec(str)

  if (result) {
    return {
      value: result[0],
      index: result.index,
    }
  }

  return null
}

const getAddressNumber = (str: string): Value | null => {
  const addressRe = /(([0-9]+)([a-lA-L])?(\/))*([0-9]+)[a-lA-L]?/
  const result = addressRe.exec(str)

  if (result) {
    return {
      value: result[0],
      index: result.index,
    }
  }

  return {
    value: '',
    index: -1,
  }
}

const normalize = (str: string) => {
  const arr = str.split(' ')

  return arr
    .map(_.capitalize)
    .join(' ')
    .trim()
    .replace(/\s,/g, ',')
    .replace(/,$/g, '')
}

const getAddress = (str: string, original: string): Address | null => {
  const number = getAddressNumber(str)
  const county = getAdmin(str)

  if (!county || !number) {
    return null
  }

  const lastIndex = county.index + county.value.length
  const value = original.slice(number.index, lastIndex)

  return {
    raw: original,
    value,
    index: county.index,
    lastIndex,
    number: number,
    county: county.county,
    region: county.region,
  }
}

export const extract = (str: string): Address | null => {
  const formatted = removeAccents(str)

  const phoneNumber = getPhoneNumber(str)

  if (phoneNumber) {
    return getAddress(
      formatted.replace(phoneNumber.value, ''),
      str.replace(phoneNumber.value, '')
    )
  }

  return getAddress(formatted, str)
}

export const extractParts = (str: string) => {
  const result = extract(str)

  if (result) {
    const { value: number, index: numberIndex } = result.number
    const region = result.region.name
    const regionLevel = result.region.level
    const county = result.county.name
    const countyLevel = result.county.level
    const street = result.raw.slice(numberIndex + number.length, result.index)

    return {
      value: result.value,
      number,
      region,
      regionLevel,
      county,
      countyLevel,
      street: normalize(street),
      format(): string {
        return `${this.number} ${this.street}, ${this.countyLevel} ${county}, ${this.region}`
      },
    }
  }

  return {
    format(): string {
      return ''
    },
  }
}
