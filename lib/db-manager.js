const mongoose = require('mongoose');
const globalVar = require('../global/global.js');
const ip = globalVar.DOCKER_IP;
// diagrammodule
// const connectDB=(dbname)=>{
//   mongoose.connect(`mongodb://localhost/${dbname}`, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB에 연결되었습니다.'))
//   .catch(err => console.error('MongoDB 연결에 실패했습니다.', err))
// };
// module.exports={
//   connectDB
// }


module.exports={
 connectDB(dbname){mongoose.connect(`mongodb://${ip}/${dbname}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB에 연결되었습니다.'))
  .catch(err => console.error('MongoDB 연결에 실패했습니다.', err))},
};






// mongoose.connection.db.admin().listDatabases()
//   .then(result => {
//     const databaseExists = result.databases.find(database => database.name === databaseName);
//     if (!databaseExists) {
//       return mongoose.connection.db.createDatabase(databaseName);
//     } else {
//       console.log('Database already exists.');
//     }
//   })
//   .then(() => console.log(`Database ${databaseName} created.`))
//   .catch(err => console.log(err))
//   .finally(() => mongoose.disconnect());
