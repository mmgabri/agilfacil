const PORT = process.env.PORT || 9000;

const CORS_OPTIONS = {
  origin: "*",
  methods: ["GET", "POST"]
};

const REGION = 'ap-south-1'

const TABLE_USER_BOARD = 'board_user'

const TABLE_BOARD = 'board'

module.exports = { PORT, CORS_OPTIONS, TABLE_USER_BOARD, TABLE_BOARD, REGION  };