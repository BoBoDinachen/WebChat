function User(account, password) {
  return {
    account,
    password,
    age: 18,
    sex: "女",
    user_name: "一只小猫咪😽",
    avatar_url: "",
    signature: "还没有设置个性签名噢~",
    friend_list: [],
    like_list: [],
    follow_list: [],
    room_id: ""
  }
}
module.exports = {
  User
}