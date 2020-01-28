const { exec } = require('../db/mysql')

const getFrontRoomList = (page, size, type, q, roomtype) => {
  let sql = `
      select id, type, number, price, isClean, isBook, booktime, isRent, customerName, livetime, customerIdentity, preLiveTime, isLive, cleantime, cleaner, tel, deposit from rooms where 1 = 1
  `
  if (type == 'book') {
    sql += `
      and isBook = 1
    `
  } else if (type == 'live') {
    sql += `
      and isLive = 1
    `
  }
  if (roomtype && roomtype != " ") {
    console.log(1)
    sql += `
      and type = '${roomtype}'
    `
  }
  if (q) {
    sql += `
      and number like '${q}%'
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

const bookFront = (id, bookTime, customerName, customerIdentity, tel, deposit) => {
  const sql = `
     UPDATE rooms SET bookTime = '${bookTime}', customerName = '${customerName}', customerIdentity = '${customerIdentity}', tel = '${tel}', deposit = '${deposit}', isBook = 1 WHERE id = '${id}'
  `

  return exec(sql).then(rows => {
    return rows
  })
}

const unbookFront = (id) => {
  const sql = `
     UPDATE rooms SET bookTime = '', customerName = '', customerIdentity = '', tel = '', deposit = '', isBook = 0 WHERE id = '${id}'
  `

  return exec(sql).then(rows => {
    return rows
  })
}

const liveFront = (id, livetime, customerName, customerIdentity, preLiveTime, tel, deposit) => {
  const sql = `
     UPDATE rooms SET livetime = '${livetime}', customerName = '${customerName}', customerIdentity = '${customerIdentity}', tel = '${tel}', deposit = '${deposit}', preLiveTime = '${preLiveTime}', isLive = 1 WHERE id = '${id}'
  `

  return exec(sql).then(rows => {
    return rows
  })
}

const leaveFront = (id) => {
  const sql = `
     UPDATE rooms SET booktime = '', livetime = '', customerName = '', customerIdentity = '', preLiveTime = '', tel = '', deposit = '', isLive = 0, isBook = 0, isClean = 0, cleaner = '', cleantime = '' WHERE id = '${id}'
  `

  return exec(sql).then(rows => {
    return rows
  })
}

const saveRoomRecord = (number, totalPrice, bookTime, liveTime, customerName, customerIdentity, leaveTime, preLiveTime, tel, deposit) => {
  const sql = `
    INSERT INTO liveRecord VALUES (null, '${number}', '${totalPrice}', '${bookTime}', '${liveTime}', '${customerName}', '${deposit}', '${tel}', '${customerIdentity}', '${leaveTime}', '${preLiveTime}', 0, '')
  `

  return exec(sql).then(rows => {
    return rows;
  })
}

const getMoneyList = (page, size, income) => {
  let sql = `
      select id, number, totalPrice, bookTime, liveTime, customerName, tel, deposit, customerIdentity, leaveTime, preLiveTime, isPay, setPayName from liveRecord where 1=1
  `
  if (income) {
    sql += `and isPay = 1`
  }
  sql += `
    ORDER BY leaveTime asc
  `
  return exec(sql).then(rows => {
    rows.reverse();
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

const setMoneyIsPay = (ids, name) => {
  let sql = ""
  if (ids.length == 1) {
    sql = `
        UPDATE liveRecord SET isPay = 1, setPayName = '${name}' WHERE id = '${ids[0]}';
    `
  } else {
    sql = `
        UPDATE liveRecord SET isPay = 1 WHERE id = '${ids[0]}'
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
  getFrontRoomList,
  bookFront,
  unbookFront,
  liveFront,
  leaveFront,
  saveRoomRecord,
  getMoneyList,
  setMoneyIsPay
}