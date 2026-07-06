export default {
  client: 'mysql2',
  connection: {
    host: 'localhost',  // ← was '3306', that's the port not the host
    port: 3306,         // ← port goes here
    user: 'rentalsuser',
    password: 'BestUNITCAB230!26',
    database: 'rentals',
  },
};