const {
  exec
} = require('../db/mysql')

const getCleanerList = (page, size, q) => {
  let sql = `
      select id, number, isClean, cleaner, cleantime, isLive, isBook from rooms where 1 = 1
  `
  if (q) {
    sql += `
      and isClean = '${q}'
    `
  }
  sql += `ORDER BY number asc`
  return exec(sql).then(rows => {
    if (page == 1) {
      return {
        rows: rows.slice(0, size) || [],
        total: rows.length,
        page: page,
        size: size
      }
    } else {
      return {
        rows: rows.slice((page - 1) * size, page * size) || [],
        total: rows.length,
        page: page,
        size: size
      }
    }
  })
}

const setRoomClean = (ids, name) => {
  let d = new Date();
  let cleantime = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() <
    10 ? '0' : '') + d.getDate() + ' ' + (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() <
    10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
  let sql = ""
  if (ids.length == 1) {
    sql =
      `
        UPDATE rooms SET isClean = 1, cleaner = '${name}', cleantime = '${cleantime}' WHERE id = '${ids[0]}';
    `
  } else {
    sql =
      `
        UPDATE rooms SET isClean = 1, cleaner = '${name}', cleantime = '${cleantime}' WHERE id = '${ids[0]}'
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

const setRoomUnclean = (ids) => {
  let sql = ""
  if (ids.length == 1) {
    sql = `
        UPDATE rooms SET isClean = 0, cleaner = '', cleantime = '' WHERE id = '${ids[0]}';
    `
  } else {
    sql = `
        UPDATE rooms SET isClean = 0, cleaner = '', cleantime = '' WHERE id = '${ids[0]}'
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

const receiveTask = (id, name) => {
  const sql = `
      UPDATE rooms SET isClean = 2, cleaner = '${name}' WHERE id = '${id}';
  `
  return exec(sql).then(rows => {
    return rows
  })
}

module.exports = {
  getCleanerList,
  setRoomClean,
  setRoomUnclean,
  receiveTask
}
