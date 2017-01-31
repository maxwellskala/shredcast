function parseJSON(response) {
  return response.json();
}

function prepareErrors(response) {
  const validationErrors = response.validationErrors;
  if (!validationErrors) {
    return response;
  }
  const processedErrors = validationErrors.map((rawError) => {
    return rawError.msg;
  });
  return { ...response, validationErrors: processedErrors };
}

function checkSession(cb) {
  return fetch('api/user', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'get',
    credentials: 'same-origin'
  })
  .then(parseJSON)
  .then(prepareErrors)
  .then(cb);
}

function signup(email, password, cb) {
  return fetch('api/user/signup', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify({
      email,
      password
    })
  })
  .then(parseJSON)
  .then(prepareErrors)
  .then(cb);
}

function login(email, password, cb) {
  return fetch('api/user/login', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    method: 'post',
    body: JSON.stringify({
      email,
      password
    })
  })
  .then(parseJSON)
  .then(prepareErrors)
  .then(cb);
}

function logout(cb) {
  return fetch('api/user/logout', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'get',
    credentials: 'same-origin'
  })
  .then(parseJSON)
  .then(prepareErrors)
  .then(cb);
}

const Client = { checkSession, signup, login, logout };
export default Client;