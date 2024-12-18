const PORT = process.env.PORT || 9000;

const CORS_OPTIONS = {
  origin: "*",
  methods: ["GET", "POST"]
};

const REGION = 'ap-south-1'

const TABLE_BOARD = 'board'

const INDEX_NAME_USER = 'gsi_board_user'

module.exports = { PORT, CORS_OPTIONS, TABLE_BOARD, INDEX_NAME_USER, REGION  };