const connection = require("../db/mysql_connection");

// @desc 글을 업로드 하는 API
// @route PUT /api/v1/user/board
// @request tite , comment, category, endtime , user_id(auth)
// @response success

exports.BoardUpload = async (req, res, next) => {
  let user_id = req.user.id;
  let title = req.body.title;
  let content = req.body.content;
  let category = req.body.category;

  if (!user_id || !title || !content || !category) {
    res.status(400).json({ message: "hi" });
    return;
  }

  console.log(req.body);

  let query = `insert into p_board (title, content , category , user_id) values (
      "${title}", "${content}","${category}",${user_id})`;
  console.log(query);
  try {
    [result] = await connection.query(query);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
  res.status(200).json();
};
