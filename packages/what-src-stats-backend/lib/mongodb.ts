import { MongoClient } from 'mongodb'

const uri = (username: string, password: string) =>
    `mongodb+srv://${username}:${password}` +
    '@cluster0-ykqus.mongodb.net/test' +
    '?retryWrites=true&w=majority'

const username = encodeURI(process.env.DB_USER || '')
const password = encodeURI(process.env.DB_PASS || '')

const client = new MongoClient(uri(username, password), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferMaxEntries: 0,
  autoReconnect: true,
  reconnectInterval: 5000,
  appname: 'what-src-stats',
  reconnectTries: Infinity,
})

client.on('error', console.error.bind(console, 'connection error:'))

console.log('Attempting to connect to MongoDB..')
client.connect(err => {
  if (err != null && err.message) {
    console.error(
      '[Error @ ' + new Date().toUTCString() + ']: ' + err.message
    )
  }
  console.log('MongoDB client connected successfully √')
})

process.on('beforeExit', () => {
  if (client.isConnected) {
    console.log(' - cleaning up open db connections before exit..')
    client.close().catch(console.error)
  }
})

export { client }
