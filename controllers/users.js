const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connection = require("../db/mysql_connection");

// @desc 회원가입
// @route POST /api/v1/users
// @request email, passwd, nickname, username, birth, gender
// @response success

exports.createUser = async (req, res, next) => {
  let email = req.body.email;
  let passwd = req.body.passwd;
  let nickname = req.body.nickname;

  if (!email || !passwd || !nickname) {
    res.status(400).json({ message: "파라미터 잘못" });
    return;
  }
  if (!validator.isEmail(email)) {
    res.status(400).json({ message: "파라미터 잘못" });
    return;
  }

  const hashedPasswd = await bcrypt.hash(passwd, 8);

  let query = "insert into p_user (email, passwd, nickname) values (?,?,?)";
  let data = [email, hashedPasswd, nickname];

  let user_id;

  const conn = await connection.getConnection();
  await conn.beginTransaction();

  try {
    [result] = await conn.query(query, data);
    user_id = result.insertId;
  } catch (e) {
    if (e.errno == 1062) {
      res.status(401).json({ success: false, error: 1 });
    }
    await conn.rollback();
    res.status(500).json({ success: false, error: e });
    return;
  }

  const token = jwt.sign({ user_id: user_id }, process.env.ACCESS_TOKEN_SECRET);
  query = "insert into p_token (user_id, token) values (?,?)";
  data = [user_id, token];

  try {
    [result] = await conn.query(query, data);
  } catch (e) {
    await conn.rollback();
    res.status(500).json();
    return;
  }

  await conn.commit();
  await conn.release();
  res.status(200).json({ success: true, token: token });
};
