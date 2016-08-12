/**
 * Module dependencies.
 */

const appPromise = require('./app')
const debug = require('debug')('laundree.server')
const http = require('http')
const config = require('config')
const {socketIoSetup} = require('./lib')

const port = normalizePort(config.get('web.port'))

module.exports = appPromise.then((app) => {
  /**
   * Get port from environment and store in Express.
   */

  app.set('port', port)

  /**
   * Create HTTP server.
   */
  const server = http.createServer(app)
  return () => {
    server.listen(port)
    server.on('error', onError)
    server.on('listening', () => onListening(server))
    socketIoSetup(server)
  }
})

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening (server) {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}

