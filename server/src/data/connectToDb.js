const user = "admin";
const password = "WIMyYQpMad5nHKqz";

const MONGO_URI= process.env.MONGO_URI || `mongodb+srv://${user}:${password}@test.9g8lf.mongodb.net/?retryWrites=true&w=majority&appName=test`;

console.log('MONGO_URI', MONGO_URI);


function connectToDb(dbInstance) {
    dbInstance.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB подключен к " + MONGO_URI))
    .catch((err) => console.error("Ошибка подключения:", err));
}

module.exports = connectToDb;