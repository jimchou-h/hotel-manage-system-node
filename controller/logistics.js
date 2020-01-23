const { exec } = require('../db/mysql')

const getPaymentList = (page, size, pay) => {
  let sql = `
      select id, name, price, number, updateTime, description, isAllow, isBuy from payment where 1 = 1
  `
  if (pay) {
    sql += ` and isBuy = 1 `
  }
  sql += `ORDER BY updateTime DESC`
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

const addPayment = (name, price, number, description) => {
  let d = new Date();
  let updateTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() +
  ':' + d.getMinutes() + ':' + d.getSeconds();
  const sql = `
     INSERT INTO payment VALUES (null, '${name}', '${price}', '${number}', '${updateTime}', '${description}', 0, 0)
  `
  return exec(sql).then(rows => {
    return rows
  })
}

const editPayment = (id, name, price, number, description) => {
  let d = new Date();
  let updateTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() +
  ':' + d.getMinutes() + ':' + d.getSeconds();
  const sql = `
     UPDATE payment SET name = '${name}', price = '${price}', number = '${number}', updateTime = '${updateTime}', description = '${description}', isAllow = 0 WHERE id = '${id}'
  `
  return exec(sql).then(rows => {
    return rows
  })
}

const delPayment = (id) => {
  const sql = `
      DELETE FROM payment WHERE id = '${id}' 
  `
  return exec(sql).then(rows => {
    return rows
  })
}

const setbuyPayment = (ids) => {
  let sql = ""
  if (ids.length == 1) {
    sql = `
        UPDATE payment SET isBuy = 1 WHERE id = '${ids[0]}';
    `
  } else {
    sql = `
        UPDATE payment SET isBuy = 1 WHERE id = '${ids[0]}'
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
  getPaymentList,
  addPayment,
  editPayment,
  delPayment,
  setbuyPayment
}