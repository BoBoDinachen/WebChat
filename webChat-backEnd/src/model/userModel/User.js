class User {
  constructor(account,userName,age) {
    this.accout = account;
    this.userName = userName;
    this.age = age;
  }
  toString() {
    console.log(`{account:${this.accout},userName:${this.userName},age:${this.age}}`);
  }
}