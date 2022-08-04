const http = require('http');

const app = require('./app');

const connectDB = require('./configs/connectDB');

const server = http.createServer(app);

let DB;

if (process.env.NODE_ENV === 'development') {
  DB = process.env.MONGO_LOCAL;
} else {
  DB = process.env.MONGO_URI;
}

const startServer = async () => {
  const PORT = process.env.PORT || 4000;
  try {
    await connectDB(DB);
    console.log('DB connection started...');
    server.listen(PORT, () =>
      console.log(`Server started on port ${PORT} and DB connected`)
    );
  } catch (error) {
    console.log(`ERROR OCCUR: ${error}`);
  }
};

startServer();
