var UserSQL = {
    insert: 'insert into userMessage(userName,phone,userPwd,birthday,userlogo,levels,stutas,sex) values (?,?,?,?,?,?,?,?)',
    queryAll: 'SELECT * FROM userMessage',
    getUserById: 'SELECT * FROM userMessage WHERE userId = ? ',
    getUserByCount: 'SELECT * FROM userMessage WHERE userPwd= ? and phone = ?',
    updateUser:'update usermessage set userName=?,userPwd=?,birthday=?,userlogo=?,sex=? where userId=?'
};
module.exports = UserSQL;