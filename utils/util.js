function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function setSteps(_this,num){
  var that=_this
  for (var i =3; i >= 0; i--) {
    that.setData({
      [`steps[${i}].current`]:false,
       [`steps[${i}].done`]:false
  })
  }
  that.setData({
      [`steps[${num}].current`]:true,
      [`steps[${num}].done`]:true
  })
  for (var i = num- 1; i >= 0; i--) {
    that.setData({
      [`steps[${i}].done`]:true,
      [`steps[${i}].current`]:false
    })        
  }
}

module.exports = {
  formatTime: formatTime,
  setSteps:setSteps
}
