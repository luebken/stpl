import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";


const cognitoSettings = {
  UserPoolId: 'us-east-1_n9E1pHkMX',
  ClientId: '5mci9av5crotk4uqut7ol6tqr8'
}

export function IsSignedIn() {
  console.log(getCurrentUser() != null)
  return getCurrentUser() != null
}

export function SignIn(params) {
  var authDetails = new AuthenticationDetails(params)
  var userData = {
    Pool: getCurrentPool(),
    Username: params.Username
  }
  var cognitoUser = new CognitoUser(userData)
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: result => { 
        resolve(result)
        console.log("success")
        window.location.reload();
      },
      onFailure: err => { reject(err) }
    })
  })
}

export function SignOut() {
  var me = getCurrentUser()
  if (me !== null) me.signOut()
}

function getCurrentPool() {
  return new CognitoUserPool(cognitoSettings)
}

function getCurrentUser() {
  return getCurrentPool().getCurrentUser()
}

export function decodeUserInfo(token) {
  return JSON.parse(
    window.atob(
      token.split('.')[1]
        .replace('-', '+')
        .replace('_', '/')
    )
  )
}

function getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function (err, session) {
      if (err) {
        reject(err)
        return
      }
      resolve(session.getIdToken().getJwtToken())
    })
  })
}

function myToken() {
  return new Promise((resolve, reject) => {
    var me = getCurrentUser()
    if (me === null) {
      reject('No user found')
    } else {
      resolve(getUserToken(me))
    }
  })
}

export function WithToken() {
  return myToken().catch(err => {
    return Promise.reject('No user found')
  })
}
