const PORT = process.env.PORT || 9000;

const CORS_OPTIONS = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
};

module.exports = { PORT, CORS_OPTIONS };