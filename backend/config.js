const PORT = process.env.PORT || 9000;

const CORS_OPTIONS = {
  origin: "*",
  methods: ["GET", "POST"]
};

module.exports = { PORT, CORS_OPTIONS };