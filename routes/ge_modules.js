var express = require('express');
var router = express.Router();

const mEC7Bearing = require('../ge_modules/mEC7_Bearing');

router.get('/EC7_Bearing/calc_EC7_D1', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D1 (${s})', ip:'${ip}'`);
  var r = mEC7Bearing.calc_EC7_D1_data(req.query)
  res.json(r);
})
router.get('/EC7_Bearing/calc_EC7_D1_nc', (req, res) => {
    var datetime = new Date().toLocaleString();
    var s = JSON.stringify(req.query)
    var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    console.log(`datetime: '${datetime}', func: 'calc_EC7_D1_nc (${s})', ip:'${ip}'`);
    var r = mEC7Bearing.calc_EC7_D1_data(req.query,'calc_D1_nc')
    res.json(r);  
})
router.get('/EC7_Bearing/calc_EC7_D1_ic', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D1_ic (${s})', ip:'${ip}'`);
  var r = mEC7Bearing.calc_EC7_D1_data(req.query,'calc_D1_ic')
  res.json(r);
})
router.get('/EC7_Bearing/calc_EC7_D1_bc', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D1_bc (${s})', ip:'${ip}'`);
  var r = mEC7Bearing.calc_EC7_D1_data(req.query,'calc_D1_bc')
  res.json(r);
})
router.get('/EC7_Bearing/calc_EC7_D1_qnc', (req, res) => {
    var datetime = new Date().toLocaleString();
    var s = JSON.stringify(req.query)
    var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    console.log(`datetime: '${datetime}', func: 'calc_EC7_D1_qnc (${s})', ip:'${ip}'`);
    var r = mEC7Bearing.calc_EC7_D1_data(req.query,'calc_D1_qnc')
    res.json(r);  
})


router.get('/EC7_Bearing/calc_EC7_D2', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D2 (${s})', ip:'${ip}'`);
  var r = mEC7Bearing.calc_EC7_D2_data(req.query)
  res.json(r);
})
router.get('/EC7_Bearing/calc_EC7_D2_nc', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_nc (${s})', ip:'${ip}'`);
  var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_nc')
  res.json(r);  
})
router.get('/EC7_Bearing/calc_EC7_D2_ic', (req, res) => {
var datetime = new Date().toLocaleString();
var s = JSON.stringify(req.query)
var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_ic (${s})', ip:'${ip}'`);
var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_ic')
res.json(r);
})
router.get('/EC7_Bearing/calc_EC7_D2_bc', (req, res) => {
var datetime = new Date().toLocaleString();
var s = JSON.stringify(req.query)
var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_bc (${s})', ip:'${ip}'`);
var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_bc')
res.json(r);
})
router.get('/EC7_Bearing/calc_EC7_D2_qnc', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_qnc (${s})', ip:'${ip}'`);
  var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_qnc')
  res.json(r);  
})
router.get('/EC7_Bearing/calc_EC7_D2_ng', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_ng (${s})', ip:'${ip}'`);
  var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_ng')
  res.json(r);  
})
router.get('/EC7_Bearing/calc_EC7_D2_ig', (req, res) => {
var datetime = new Date().toLocaleString();
var s = JSON.stringify(req.query)
var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_ig (${s})', ip:'${ip}'`);
var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_ig')
res.json(r);
})
router.get('/EC7_Bearing/calc_EC7_D2_bg', (req, res) => {
var datetime = new Date().toLocaleString();
var s = JSON.stringify(req.query)
var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_bg (${s})', ip:'${ip}'`);
var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_bg')
res.json(r);
})
router.get('/EC7_Bearing/calc_EC7_D2_qng', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_qng (${s})', ip:'${ip}'`);
  var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_qng')
  res.json(r);  
})
router.get('/EC7_Bearing/calc_EC7_D2_nq', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_nq (${s})', ip:'${ip}'`);
  var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_nq')
  res.json(r);  
})
router.get('/EC7_Bearing/calc_EC7_D2_iq', (req, res) => {
var datetime = new Date().toLocaleString();
var s = JSON.stringify(req.query)
var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_iq (${s})', ip:'${ip}'`);
var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_iq')
res.json(r);
})
router.get('/EC7_Bearing/calc_EC7_D2_bq', (req, res) => {
var datetime = new Date().toLocaleString();
var s = JSON.stringify(req.query)
var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_bq (${s})', ip:'${ip}'`);
var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_bq')
res.json(r);
})
router.get('/EC7_Bearing/calc_EC7_D2_qnq', (req, res) => {
  var datetime = new Date().toLocaleString();
  var s = JSON.stringify(req.query)
  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
  console.log(`datetime: '${datetime}', func: 'calc_EC7_D2_qnq (${s})', ip:'${ip}'`);
  var r = mEC7Bearing.calc_EC7_D2_data(req.query,'calc_D2_qnq')
  res.json(r);  
})

module.exports = router;
