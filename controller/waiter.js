const { exec } = require('../db/mysql')

const getDemandList = (page, size, manager) => {
  const sql = `
      select id, number, tel, demand, situation, updateTime, dealer, dealTime from demand ORDER BY updateTime DESC
  `

  return exec(sql).then(rows => {
    if (manager) {
      var finish = 0, unfinish = 0;
      for (let i = 0, j = rows.length; i < j; i++) {
        if (rows[i].situation == 1) {
          finish++
        }
        if (rows[i].situation == -1) {
          unfinish++
        }
      }
    }
    if (page == 1) {
      return {
        rows: rows.slice(0, size) || [],
        total: rows.length,
        page: page,
        size: size,
        finish: typeof finish == 'number' ? finish : null,
        unfinish: typeof unfinish == 'number' ? unfinish : null
      }
    } else {
      return {
        rows: rows.slice((page - 1) * size, page * size) || [],
        total: rows.length,
        page: page,
        size: size,
        finish: typeof finish == 'number' ? finish : null,
        unfinish: typeof unfinish == 'number' ? unfinish : null
      }
    }
  })
}

const setDemandFinish = (ids, name) => {
  let d = new Date();
  let dealTime = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' : '')  + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate() + ' ' + (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  let sql = ""
  if (ids.length == 1) {
    sql = `
        UPDATE demand SET situation = 1, dealer = '${name}', dealTime = '${dealTime}' WHERE id = '${ids[0]}';
    `
  } else {
    sql = `
        UPDATE demand SET situation = 1, dealer = '${name}', dealTime = '${dealTime}' WHERE id = '${ids[0]}'
    `
    for (let i = 1, j = ids.length; i < j; i++) {
      sql += `
        or id = '${ids[i]}'
      `
      if (j == ids.length - 1) {
        sql += `
          ;
        `
      }
    }
  }
  return exec(sql).then(rows => {
    return rows
  })
}

const setDemandUnfinish = (ids, name) => {
  let d = new Date();
  let dealTime = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' : '')  + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate() + ' ' + (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  let sql = ""
  if (ids.length == 1) {
    sql = `
        UPDATE demand SET situation = -1, dealer = '${name}', dealTime = '${dealTime}' WHERE id = '${ids[0]}';
    `
  } else {
    sql = `
        UPDATE demand SET situation = -1, dealer = '${name}', dealTime = '${dealTime}' WHERE id = '${ids[0]}'
    `
    for (let i = 1, j = ids.length; i < j; i++) {
      sql += `
        or id = '${ids[i]}'
      `
      if (j == ids.length - 1) {
        sql += `
          ;
        `
      }
    }
  }
  return exec(sql).then(rows => {
    return rows
  })
}

module.exports = {
  getDemandList,
  setDemandFinish,
  setDemandUnfinish
}