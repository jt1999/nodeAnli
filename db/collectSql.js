var collectSql = {
   selectUserAll:'select c.collectId,c.collectType,c.create_dt,i.informationId,i.title from collect c \n' +
   'join usermessage u ON u.userId=c.userId\n' +
   'join information i on i.informationId=c.otherId\n' +
   'where c.userId=? and c.collectType=?\n' +
   'and c.collectId > (?-1)*10 limit 10; \n' +
   'order by c.create_dt DESC'
};
module.exports = collectSql;