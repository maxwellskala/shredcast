
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

function test(cb) {
  return fetch('api/test', {
    accept: 'application/json'
  }).then(checkStatus)
    .then(parseJSON)
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
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function login(email, password, cb) {
  return fetch('api/user/login', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify({
      email,
      password
    })
  }).then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

const Client = { test, signup, login };
export default Client;