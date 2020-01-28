const { exec } = require('../db/mysql')

const setallowPayment = (ids) => {
  let sql = ""
  if (ids.length == 1) {
    sql = `
        UPDATE payment SET isAllow = 1 WHERE id = '${ids[0]}';
    `
  } else {
    sql = `
        UPDATE payment SET isAllow = 1 WHERE id = '${ids[0]}'
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

const setdisallowPayment = (ids) => {
  let sql = ""
  if (ids.length == 1) {
    sql = `
        UPDATE payment SET isAllow = -1 WHERE id = '${ids[0]}';
    `
  } else {
    sql = `
        UPDATE payment SET isAllow = -1 WHERE id = '${ids[0]}'
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

const getTotalIncome = () => {
  const sql = `
      select totalPrice from liveRecord
  `
  return exec(sql).then(rows => {
    let total = 0
    if (rows.length > 0) {
      for (let i = 0, j = rows.length; i < j; i++) {
        total += rows[i].totalPrice
      }
      return total
    }
    return 0
  })
}

const getTotalPay = () => {
  const sql = `
      select price, number from payment where isAllow = 1 and isBuy = 1
  `
  return exec(sql).then(rows => {
    let total = 0;
    if (rows.length > 0) {
      for (let i = 0, j = rows.length; i < j; i++) {
        total += Number(rows[i].price) * rows[i].number
      }
      return total
    }
    return 0
  })
}

const getSituation = (page, size) => {
  const sql = `
      select id, number, star, situation from situation ORDER BY id DESC
  `
  return exec(sql).then(rows => {
    let data = {};
    data.page = page;
    data.size = size;
    data.total = rows.length;
    let satisify = 0;
    if (rows.length > 0) {
      for (let i = 0, j = rows.length; i < j; i++) {
        if (rows[i].star > 3) {
          satisify ++
        }
      }
      if (page == 1) {
        data.rows = rows.slice(0, size);
      } else {
        data.rows = rows.slice((page - 1) * size, page * size);
      }
      data.satisify = satisify;
      data.unsatisify = rows.length - satisify
      return data;
    }
    data.rows = [];
    data.satisify = 0;
    data.unsatisify = 0;
    return data;
  })
}

const getTimes = () => {
  const sql = `
      select customerName, customerIdentity, tel, count(*) as num from liverecord group by customerIdentity ORDER BY num DESC
  `
  return exec(sql).then(rows => {
    return rows
  })
}

module.exports = {
  setallowPayment,
  setdisallowPayment,
  getTotalIncome,
  getTotalPay,
  getSituation,
  getTimes
}