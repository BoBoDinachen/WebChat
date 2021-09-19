const express = require("express");
// 1.创建路由
const router = express.Router();
const {
  insertFriendData,
  getRequestRecordList,
  changeRequestStatus
} = require("../service/messageService/index")
const { addFriend } = require("../service/userService/index")

// 同意好友申请的接口
router.post("/addFriend", (request, response) => {
  const { uid, uname, incr_uid, fname } = request.body; //请求数据
  // 调用接口
  if (uid !== "" && incr_uid !== "") {
    addFriend({ uid, incr_uid, fname }).then((res) => {
      let flag = res.data;
      switch (flag) {
        case "exist":
          response.send({ "status": 200, "success": false, "msg": "该好友已添加" })
          break;
        case "success":
          // 往消息记录文件里面添加好友的记录
          insertFriendData({ uid, fid: incr_uid, fname, uname }).then((result) => {
            console.log(result);
          }).catch((err) => {
            console.log(err);
          });
          // 修改申请记录文件对应的状态
          changeRequestStatus({ "status": 2, "uid": uid, "fid": incr_uid }).then((res) => {
            console.log(res);
            response.send({ "status": 200, "success": true, "msg": "好友添加成功" });
          })
          break;
        case "fail":
          response.send({ "status": 200, "success": false, "msg": "好友添加失败,数据库错误" });
          break;
      }
    })
  }

})
// 获取好友申请记录列表
router.get("/getRequestList", (request, response) => {
  const { uid } = request.query;
  getRequestRecordList({ uid }).then((res) => {
    response.send(res);
  }, (err) => {
    console.log(err);
  })

})
// 拒绝好友申请的接口
router.post("/refuseRequest", (request, response) => {
  const { uid, fid } = request.body;
  changeRequestStatus({ "status": 3, uid, fid }).then((res) => {
    console.log(res);
    response.send(res);
  })
})
// 删除好友申请记录
router.post("/deleteRequest", (request, response) => {

})
// 3. 导出路由
module.exports = router;