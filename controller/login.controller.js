const axios = require('axios');
const qs = require('qs');

exports.validateCode = (req, res) => {
  let data = qs.stringify({
    'grant_type': Object.keys(req.query).includes('refresh_token') ? 'refresh_token' : 'authorization_code',
    'client_id': process.env.KEYCLOAK_CLIENTID,
    'client_secret': process.env.KEYCLOCK_CLIENT_SECRET_KEY,
    [`${Object.keys(req.query).includes('refresh_token') ? 'refresh_token' : 'code'}`]:  Object.keys(req.query).includes('refresh_token') ? req.query.refresh_token : req.query.code
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `http://localhost:8080/realms/${process.env.KEYCLOCK_REALMNAME}/protocol/openid-connect/token`,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    if (response.status == 200) {
      res.status(200).json(response.data);
    }
  })
  .catch((error) => {
    res.status(400).json({
      status: 400,
      message: 'Error in validating code'
    })
  });
}


exports.creatingNewUser = async (req, res) => {
  try {
    let data = JSON.stringify(req?.body || '');
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8080/admin/realms/${process.env.KEYCLOCK_REALMNAME}/users`,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': req?.headers?.authorization
      },
      data : data
    };
    
    const response = await axios.request(config);
    if (response.status === 200 || response?.status === 201 && response?.statusText === 'Created') {
      res.status(200).json({
        status: 200,
        message: 'User Created Successfully',
      });
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 400,
      message: 'Error in creating user'
    })
  }
}