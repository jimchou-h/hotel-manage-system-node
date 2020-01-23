var express = require('express');
var router = express.Router();
const { getFrontRoomList, bookFront, unbookFront, liveFront, leaveFront, saveRoomRecord, getMoneyList, setMoneyIsPay } = require('../controller/front')
const { checkParams } = require('../utils/methods')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.post('/room/list', async function (req, res, next) {
    const { page, size, type, q } = req.body
    let paramsResult = await checkParams(res, page, size)
    if (!paramsResult) {
        return;
    }
    let checkResult = await checkPower(req.session, res)
    if (!checkResult) {
        return;
    }
    const result = getFrontRoomList(page, size, type, q)
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

router.post('/room/book', async function (req, res, next) {
  const { id, bookTime, customerName, customerIdentity, tel, deposit } = req.body
  let paramsResult = await checkParams(res, id, bookTime, customerName, customerIdentity, tel, deposit)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = bookFront(id, bookTime, customerName, customerIdentity, tel, deposit)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel(data)
          )
          return
      }
      res.json(
          new ErrorModel('预定客房失败')
      )
  })
});

router.post('/room/unbook', async function (req, res, next) {
  const { id } = req.body
  let paramsResult = await checkParams(res, id)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = unbookFront(id)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel(data)
          )
          return
      }
      res.json(
          new ErrorModel('取消预定客房失败')
      )
  })
});

router.post('/room/live', async function (req, res, next) {
  const { id, livetime, customerName, customerIdentity, preLiveTime, tel, deposit } = req.body
  let paramsResult = await checkParams(res, id, livetime, customerName, customerIdentity, tel, deposit)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = liveFront(id, livetime, customerName, customerIdentity, preLiveTime, tel, deposit)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel(data)
          )
          return
      }
      res.json(
          new ErrorModel('登记入住客房失败')
      )
  })
});

router.post('/room/leave', async function (req, res, next) {
  const { id } = req.body
  let paramsResult = await checkParams(res, id)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = leaveFront(id)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel(data)
          )
          return
      }
      res.json(
          new ErrorModel('退房失败')
      )
  })
});

router.post('/room/record', async function (req, res, next) {
  const { number, totalPrice, bookTime, liveTime, customerName, customerIdentity, leaveTime, preLiveTime, tel, deposit } = req.body
  let paramsResult = await checkParams(res, number, totalPrice, liveTime, customerName, customerIdentity, leaveTime, tel, deposit)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = saveRoomRecord(number, totalPrice, bookTime, liveTime, customerName, customerIdentity, leaveTime, preLiveTime, tel, deposit)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel()
          )
          return
      }
      res.json(
          new ErrorModel('保存居住记录失败')
      )
  })
});

router.post('/money/list', async function (req, res, next) {
  const { page, size, income } = req.body
  let paramsResult = await checkParams(res, page, size)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = getMoneyList(page, size, income)
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

router.post('/money/pay', async function (req, res, next) {
  const { ids, name } = req.body
  let paramsResult = await checkParams(res, name)
  if (!paramsResult) {
      return;
  }
  let checkResult = await checkPower(req.session, res)
  if (!checkResult) {
      return;
  }
  const result = setMoneyIsPay(ids, name)
  return result.then(data => {
      if (data.affectedRows > 0) {
          res.json(
              new SuccessModel()
          )
          return
      }
      res.json(
          new ErrorModel('设置已支付失败')
      )
  })
});

// 检查权限
function checkPower(session, res) {
    if (!session.position || (session.position != "front" && session.position != "manager")) {
        res.json(
            new ErrorModel('你没有操作权限')
        )
        return false
    }
    return true
}

module.exports = router;