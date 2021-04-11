const { MONGODB_URL, DB_NAME } = require("./db_config");
const MongoClient = require('mongodb').MongoClient;  // create a mongodb client
const client = new MongoClient(MONGODB_URL, { useUnifiedTopology: true }); // 根据url，实例化一个client
// Use connect method to connect to the server

// 连接MongoDB
client.connect((err, connect) => {
  if (err) throw err;
  // 1.连接数据库
  const db = connect.db(DB_NAME);
  console.log("已经连接上了");
  // 2.获取集合对象
  const collection = db.collection("users");
  collection.find({}).toArray((err, res) => {
    if (err) throw err;
    console.log(res);
    connect.close(); // 关闭连接
  })
})
// findUser(connectDB(), { userName: "XDEcat" }, (res) => {
//   console.log(res);
//   db.close();
// })


// 插入文档
const insertDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('users');
  // Insert some documents
  const users = [
    { account: "492697494@qq.com", userName: "XDEcat", age: 20 },
    { account: "1925230877@qq.com", userName: "柚酱", age: 18 },
  ]
  collection.insertMany(users, function (err, result) {
    if (err) {
      throw err;
    } else {
      console.log('插入成功...');
      callback(result);  //给回调函数传递result
    }
  });
};

// 查询所有的文档
const findDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({ a: 2 }).toArray(function (err, docs) {
    if (err) throw err;
    console.log('查找成功...');
    callback(docs);
  });
};

// 更新文档
const updateDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a: 2 }, { $set: { b: 1 } }, function (err, result) {
    if (err) throw err;
    console.log('更新成功!');
    callback(result);
  });
};

// 删除文档
const removeDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents'); //获得集合对象
  // Delete document where a is 3
  collection.deleteOne({ a: 2 }, function (err, result) {
    if (err) throw err;
    console.log('删除一个a=2的文档...');
    callback(result);
  });
};