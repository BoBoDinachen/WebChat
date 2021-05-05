const { MONGODB_URL,DB_NAME} = require("../config/db_config");
const MongoClient = require("mongodb").MongoClient;
module.exports = {
  connect: null, // 连接对象
  createDB() {
    return new Promise((resolve, reject) => {
      const client = new MongoClient(MONGODB_URL, { useUnifiedTopology: true,useNewUrlParser: true});
      client.connect((err, con) => {
        if (err) throw err;
        this.connect = con;
        resolve(this.connect.db(DB_NAME)); // 返回的是数据库连接对象
      })
    })
  },
  createConect() {
    return new Promise((resolve, reject) => {
      const client = new MongoClient(MONGODB_URL, { useUnifiedTopology: true,useNewUrlParser: true});
      client.connect((err, con) => {
        if (err) throw err;
        resolve(con); // 返回的是数据库连接对象
      })
    })
  },
  close() {
    this.connect.close(); // 关闭连接
  }
}