var express = require('express');
var router = express.Router();
const { setallowPayment, setdisallowPayment, getTotalIncome, getTotalPay, getSituation } = require('../controller/manager')
const { checkParams } = require('../utils/methods')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/payment/allow', async function (req, res, next) {
  const { ids } = req.body
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
    return;
  }
  const result = setallowPayment(ids)
  return result.then(data => {
    if (data.affectedRows > 0) {
      res.json(
        new SuccessModel()
      )
      return
    }
    res.json(
      new ErrorModel('设置已同意失败')
    )
  })
});

router.post('/payment/disallow', async function (req, res, next) {
  const { ids } = req.body
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
    return;
  }
  const result = setdisallowPayment(ids)
  return result.then(data => {
    if (data.affectedRows > 0) {
      res.json(
        new SuccessModel()
      )
      return
    }
    res.json(
      new ErrorModel('设置已同意失败')
    )
  })
});

router.post('/report/one', async function (req, res, next) {
  let data = {}
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const getIncome = getTotalIncome()
  const getPay = getTotalPay()
  return getIncome.then(income => {
    data.income = income;
    return getPay
  }).then(pay => {
    data.pay = pay
    res.json(
      new SuccessModel(data)
    )
    return
  });
});

router.post('/report/two', async function (req, res, next) {
  const { page, size } = req.body
  let paramsResult = await checkParams(res, page, size)
  if (!paramsResult) {
    return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const getSuggess = getSituation(page, size)
  return getSuggess.then(data => {
    res.json(
      new SuccessModel(data)
    )
    return
  });
});

// 检查权限
function checkPower(session, res) {
  console.log(session)
  if (!session.position || session.position != "manager") {
    res.json(
      new ErrorModel('你没有操作权限')
    )
    return false
  }
  return true
}

module.exports = router;