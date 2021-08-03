const express = require("express");
const path = require("path");
const multer = require('multer');
var upload = multer();
const {
  userLogin,
  userRegister,
  saveAvatar,
  getAvatar,
  setName,
  getFriendsInfo,
  addFriend,
  deleteFriend,
  updateProfile,
  searchFriend
} = require("../service/userService/index");  // 导入业务操作模块

const {
  getMessagesById,
  clearMessage,
  getMessageTotalById,
  insertFriendData,
  deleteFriendData
} = require("../service/messageService/index");

// 1.创建路由
const router = express.Router();

// 2.配置路由
// 处理登录
router.post("/login", (request, response) => {
  const { account, password } = request.body;
  userLogin({ "account": account, "password": password }).then((result) => {
    if (result) {
      response.json({ "status": 200, "isLogin": true, "msg": "验证成功", "data": result });
    } else {
      response.json({ "status": 200, "isLogin": false, "msg": "用户名和密码错误" });
    }
  })
})

// 处理注册
router.post("/register", (request, response) => {
  // 获取请求参数
  const { account, password, sex, age } = request.body;
  userRegister({ account, password, sex, age }).then((result) => {
    if (result) {
      response.json({ "status": 200, "isRegister": true, "msg": "注册成功" });
    } else {
      response.json({ "status": 200, "isRegister": false, "msg": "注册失败，可能该邮箱账号已被注册" });
    }
  })
})

// 上传头像
router.post("/upload/profile", upload.single("avatar"), function (request, response, next) {
  // 保存头像地址
  const uid = request.body.uid;
  // 将文件名字设置为用户id
  request.file.filename = uid;
  const fileBuffer = request.file.buffer;
  if (fileBuffer) {
    saveAvatar({ "uid": uid, fileBuffer }).then((res) => {
      if (res !== null) {
        response.json({ "status": 200, "setAvatar": true, "msg": "设置头像成功", "url": res.path });
      } else {
        response.json({ "status": 200, "setAvatar": false, "msg": "设置失败，服务器错误.." })
      }
    })
  }
  // console.log("uid:", request.body.uid);
  // console.log(request.file);
});

// 获取用户头像
router.get("/avatar", (request, response, next) => {
  // 拿到uid
  const { uid } = request.query;
  getAvatar({ uid }).then((result) => {
    const rootPath = path.join(__dirname, "../");
    response.sendFile(rootPath + result);
    // response.send(result);
  });

})

// 设置用户名
router.post("/profile/setName", (request, response) => {
  const { uid, user_name } = request.body;
  setName({ uid, user_name }).then((result) => {
    if (result !== "") {
      response.json({ "status": 200, "isSet": true, "msg": "设置成功", user_name: result });
    } else {
      response.json({ "status": 200, "isSet": false, "msg": "设置失败" })
    }
  }).catch((err) => {
    console.log(err);
  })
})

// 获取好友列表信息
router.get("/getFriends", (request, response) => {
  const { uid } = request.query;
  getFriendsInfo({ uid }).then((friends) => {
    // console.log("好友列表", friends);
    response.send({ "status": 200, "success": true, "msg": "获取好友列表成功", "data": friends });
  })
})

// 添加好友接口
router.post("/addFriend", (request, response) => {
  const { uid, incr_uid, fname } = request.body; //请求数据
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
          insertFriendData({ uid, fid: incr_uid, fname }).then((result) => {
            console.log(result);
          }).catch((err) => {
            console.log(err);
          });
          response.send({ "status": 200, "success": true, "msg": "好友添加成功" });
          break;
        case "fail":
          response.send({ "status": 200, "success": false, "msg": "好友添加失败,数据库错误" });
          break;
      }
    })
  }

})
// 删除好友的接口
router.post('/deleteFriend', (request, response) => {
  const { uid, fid } = request.body;
  if (uid && fid) {
    deleteFriend({ uid, fid }).then((res) => {
      let flag = res.data;
      if (flag === "success") {
        // 2. 清除好友的整个消息记录
        deleteFriendData({ uid, fid }).then((res) => {
          console.log(res);
        }, (err) => {
          console.log(err);
        })
        response.send({ "status": 200, "success": true, "msg": "删除成功!" });
      } else if (flag === "fail") {
        response.send({ "status": 200, "success": false, "msg": "删除失败!" });
      }
    })
  }
})
// 修改用户资料接口
router.post("/updateProfile", (request, response) => {
  // 拿到请求数据
  const { uid, sex, age, signature } = request.body;
  // 调用业务层
  updateProfile({ uid, sex, age, signature }).then((res) => {
    if (res) {
      response.send({ "status": 200, "success": true, "msg": "更新用户资料成功", "isUpdate": true });
    } else {
      response.send({ "status": 200, "success": true, "msg": "更新用户资料失败", "isUpdate": false });
    }
  })
})

// 根据用户uid获取对应的消息记录
router.get("/getMessages", (request, response) => {
  const { uid, fid } = request.query;
  if (uid && fid) {
    getMessagesById({ uid, fid }).then((result) => {
      response.send({ "status": 200, "success": true, "msg": "获取消息列表成功", "data": result });
    }, (err) => {
      response.send({ "status": 233, "success": false, "msg": err })
    })
  }
})
// 根据用户的uid和好友的fid清除对应的消息历史记录
router.get("/clearMessages", (request, response) => {
  const { uid, fid } = request.query;
  if (uid && fid) {
    clearMessage({ uid, fid }).then((res) => {
      let { msg, isOk } = res;
      if (isOk) {
        response.send({ "status": 200, "success": true, "msg": "清除消息列表成功..." })
      }
    })
  }
})

// 搜索好友的接口
router.get('/searchFriend', (request, response) => {
  const { content, uid } = request.query;
  if (content && uid) {
    searchFriend({ content, uid }).then((res) => {
      response.send({ "status": 200, "success": true, "msg": "搜索的结果...", "data": res })
    })
  }
})
// 3. 导出路由
module.exports = router;