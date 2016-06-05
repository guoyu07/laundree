/**
 * Created by budde on 05/06/16.
 */
const {createAction} = require('redux-actions')

const SIGN_IN_USER = 'SIGN_IN_USER'

/**
 * @param {UserHandler} user
 */
function userMapper (user) {
  return {
    id: user.model.id,
    photo: user.model.photo,
    displayName: user.model.displayName,
    lastSeen: user.model.lastSeen
  }
}

module.exports = {
  types: {
    SIGN_IN_USER: SIGN_IN_USER
  },
  signInUser: createAction(SIGN_IN_USER, userMapper)
}
