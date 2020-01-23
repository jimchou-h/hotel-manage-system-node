var express = require('express');
var router = express.Router();
const { getPaymentList, addPayment, editPayment, delPayment, setbuyPayment } = require('../controller/logistics')
const { checkParams } = require('../utils/methods')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/payment/list', async function (req, res, next) {
    const { page, size, pay } = req.body
    let paramsResult = await checkParams(res, page, size)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = getPaymentList(page, size, pay)
    return result.then(data => {
        if (data.rows) {
            res.json(
                new SuccessModel(data)
            )
            return
        }
        res.json(
            new ErrorModel('获取列表失败')
        )
    })
});

router.post('/payment/add', async function (req, res, next) {
  const { name, price, number, description } = req.body
  let paramsResult = await checkParams(res, name, price, number)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = addPayment(name, price, number, description)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel(data)
          )
          return
      }
      res.json(
          new ErrorModel('添加账单失败')
      )
  })
});

router.post('/payment/edit', async function (req, res, next) {
  const { id, name, price, number, description } = req.body
  let paramsResult = await checkParams(res, id, name, price, number)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = editPayment(id, name, price, number, description)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel(data)
          )
          return
      }
      res.json(
          new ErrorModel('编辑账单失败')
      )
  })
});

router.post('/payment/del', async function (req, res, next) {
  const { id } = req.body
  let paramsResult = await checkParams(res, id)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = delPayment(id)
  return result.then(data => {
      if (data.affectedRows == 1) {
          res.json(
              new SuccessModel()
          )
          return
      }
      res.json(
          new ErrorModel('删除账单失败')
      )
  })
});

router.post('/payment/setbuy', async function (req, res, next) {
  const { ids } = req.body
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = setbuyPayment(ids)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel()
          )
          return
      }
      res.json(
          new ErrorModel('设置已采购失败')
      )
  })
});

// 检查权限
function checkPower(session, res) {
    if (!session.position || (session.position != "logistics" && session.position != "manager")) {
        res.json(
            new ErrorModel('你没有操作权限')
        )
        return false
    }
    return true
}

module.exports = router;