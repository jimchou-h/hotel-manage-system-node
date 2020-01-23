var express = require('express');
var router = express.Router();
const { setCustomerSituation, setCustomerDemand } = require('../controller/customer')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/situation', function (req, res, next) {
  const { number, star, situation } = req.body
  const result = setCustomerSituation(number, star, situation)
  return result.then(data => {
    if (data.affectedRows > 0) {
      res.json(
        new SuccessModel()
      )
      return;
    }
    res.json(
      new ErrorModel('添加建议失败')
    )
  })
});

router.post('/demand', function (req, res, next) {
  const { number, tel, demand } = req.body
  const result = setCustomerDemand(number, tel, demand)
  return result.then(data => {
    if (data.affectedRows > 0) {
      res.json(
        new SuccessModel()
      )
      return;
    }
    res.json(
      new ErrorModel('添加需求失败')
    )
  })
});

module.exports = router;