var express = require('express');
var router = express.Router();
const { setallowPayment, setdisallowPayment, getTotalIncome, getTotalPay, getSituation, getTimes, getDayPeriod, getCardList, getCustomerLiveDetail } = require('../controller/manager')
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

router.post('/report/three', async function (req, res, next) {
  const { page, size } = req.body
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const times = getTimes(page, size)
  return times.then(data => {
    res.json(
      new SuccessModel(data)
    )
    return
  });
});

router.post('/report/three/detail', async function (req, res, next) {
  const { customerIdentity } = req.body
  let paramsResult = await checkParams(res, customerIdentity)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const detail = getCustomerLiveDetail(customerIdentity)
  return detail.then(data => {
    res.json(
      new SuccessModel(data)
    )
    return
  });
});

router.post('/report/dayperiod', async function (req, res, next) {
  const { preDate, currentDate } = req.body
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const period = getDayPeriod(preDate, currentDate)
  return period.then(data => {
    console.log(data)
    let xData = [], yData = []
    data.map(item => {
      xData.push(item.time)
      yData.push(item.count)
    })
    res.json(
      new SuccessModel({
        xData,
        yData
      })
    )
    return
  });
});

router.post('/report/cardlist', async function (req, res, next) {
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const cardlist = getCardList()
  return cardlist.then(data => {
    res.json(
      new SuccessModel(data)
    )
    return
  });
});

// 检查权限
function checkPower(session, res) {
  if (!session.position || session.position != "manager") {
    res.json(
      new ErrorModel('你没有操作权限')
    )
    return false
  }
  return true
}

module.exports = router;