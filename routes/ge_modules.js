var express = require('express');
var router = express.Router();

const mEC7Bearing = require('../ge_modules/mEC7_Bearing');
router.get('/EC7_Bearing', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D1 (${s})', ip:'${ip}'`);
  var data = mEC7Bearing.calc_EC7(req.query)
  res.json({
    "message": "success",
    "data": data
  });
})

router.get('/EC7_Bearing/calc_EC7_D1', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D1 (${s})', ip:'${ip}'`);
  var data = mEC7Bearing.calc_EC7_D1_data(req.query)
  res.json({
    "message": "success",
    "data": data
  });
})

router.get('/EC7_Bearing/calc_EC7_D1/param/:func', (req, res) => {
    var datetime = new Date().toLocaleString();
    var s = JSON.stringify(req.query)
    var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    var func = req.params.func;
    console.log(`datetime: '${datetime}', func: 'calc_EC7_D1/param/${func}', 'query': '${s}', ip:'${ip}'`);
    
    mEC7Bearing.calc_EC7_D1_data(req.query, func, (err, data) => {
    
      if (err) {
                res.json({
                  "message": "error",
                  "data": data
                })
      }
      
      res.json({
      "message": "success",
      "data": data
        });
    })
   
})


router.get('/EC7_Bearing/calc_EC7_D2', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D2', 'query': '${s}', ip: '${ip}'`);
  var data = mEC7Bearing.calc_EC7_D2_data(req.query)
  res.json({
    "message": "success",
    "data": data
  });
})

router.get('/EC7_Bearing/calc_EC7_D2/param/:func', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  var func = req.params.func;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D2/param/${func}', 'query': '${s}', ip:'${ip}'`);
  var data = mEC7Bearing.calc_EC7_D2_data(req.query, func)
  res.json({
    "message": "success",
    "data": data
  }); 
})


module.exports = router;
