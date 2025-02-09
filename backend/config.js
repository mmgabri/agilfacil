const PORT = process.env.PORT || 9000;

const CORS_OPTIONS = {
  origin: "*",
  methods: ["GET", "POST", "DELETE"]
};

const REGION = 'ap-south-1'

const TABLE_BOARD = 'board'

const TABLE_ROOM = 'room'

const BOARD_INDEX_NAME_USER = 'gsi_board_user'

const ROOM_INDEX_NAME_USER = 'gsi_board_user'

module.exports = { PORT, CORS_OPTIONS, TABLE_BOARD, TABLE_ROOM, BOARD_INDEX_NAME_USER, REGION, ROOM_INDEX_NAME_USER  };