import admin from './raw-admin.json'
import fs from 'fs'
import removeAccents from './utils/remove-accents'
/*
thanh pho => thanhpho|tp|thanhpho |tp
thi xa => thixa|tx|thixa |tx
huyen => huyen|h|huyen |h
quan => quan|q|quan | q
 */

const createNameRe = (value: string) => {
  const arr = value.split(' ')

  switch (arr.length) {
    case 1:
      return [value].join('|')
    case 2:
      return [value, value.replace(/\s/g, '')].join('|')
    default:
      return [
        value,
        value.replace(/\s/g, ''),
        arr[0] + ' ' + arr[1] + arr[2],
        arr[0] + arr[1] + ' ' + arr[2],
      ].join('|')
  }
}

const results = admin.reduce((acc: any[], value: any) => {
  const name = value.name.replace(/tỉnh |thành phố /gi, '')
  const region = removeAccents(name)
  const level = /tỉnh /.test(value.name) ? 'Tỉnh' : 'Thành phố'
  const counties = value.districs.reduce((acc: any[], cur: any) => {
    // const district = removeAccents(cur.name.replace(/thành phố |thị xã |huyện |quận /gi, ''))
    const district = removeAccents(cur.name)
  
    if (/thanh pho /.test(district)) {
      const rawName = district.replace(/thanh pho /, '')
    
      const nameRe = createNameRe(rawName)
      const pattern = `(thanhpho|tp)?([\\.|\\s])?(${nameRe})`
    
      return acc.concat({
        name: cur.name.replace(/thành phố /, ''),
        level: 'Thành phố',
        pattern
      })
    }
  
    if (/thi xa /.test(district)) {
      const rawName = district.replace(/thi xa /, '')
    
      const nameRe = createNameRe(rawName)
      const pattern = `(thi xa|tx)?([\\.|\\s])?(${nameRe})`
    
      return acc.concat({
        name: cur.name.replace(/thị xã /, ''),
        level: 'Thị xã',
        pattern
      })
    }
  
    if (/huyen /.test(district)) {
      const rawName = district.replace(/huyen /, '')
    
      const nameRe = createNameRe(rawName)
      const pattern = `(huyen|h)?([\\.|\\s])?(${nameRe})`
    
      return acc.concat({
        name: cur.name.replace(/huyện /, ''),
        level: 'Huyện',
        pattern
      })
    }
  
    if (/quan /.test(district)) {
      const rawName = district.replace(/quan /, '')
    
      const nameRe = createNameRe(rawName)
  
      const v1Num = parseInt(rawName)
      let pattern = `(quan|q)?([\\.|\\s])?(${nameRe})`
      
      if (!isNaN(v1Num)) {
        pattern = `(quan|q)([\\.|\\s])?(${nameRe})`
      }
    
      return acc.concat({
        name: cur.name.replace(/quận /, ''),
        level: 'Quận',
        pattern
      })
    }
  }, [])

  return acc.concat({
    name,
    level,
    counties
  })
}, [])

// console.log('data', results)
fs.writeFileSync('admin.json', JSON.stringify(results, null, 2))