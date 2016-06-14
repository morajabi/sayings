export const login = (token) => {
  if (window.localStorage) {
    localStorage.token = token;
    localStorage.isLoggedIn = true;
  } else {
    throw new Error('Can\'t manage localStorage.')
  }
}

export const logout = () => {
  if (window.localStorage) {
    if (localStorage.token)
      localStorage.removeItem('token')
    localStorage.isLoggedIn = false;
  } else {
    throw new Error('Can\'t manage localStorage.')
  }
}

export const isLoggedIn = () => {
  if (window.localStorage) {
    let { token, isLoggedIn } = localStorage
    if (token && token.length > 0 && isLoggedIn) {
      return true
    } else {
      return false
    }
  } else {
    throw new Error('Can\'t manage localStorage.')
  }
}

export const getToken = () => localStorage.token


export default {
  login,
  logout,
  isLoggedIn,
  getToken
}
