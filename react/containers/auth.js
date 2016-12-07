const connect = require('react-redux').connect
const {Auth} = require('../views')

const mapStateToProps = ({locale}, {location}) => {
  return {locale, location}
}

module.exports = connect(mapStateToProps)(Auth)