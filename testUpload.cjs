const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    // We need a dummy image file. Let's create one.
    const dummyPath = path.join(__dirname, 'dummy.jpg');
    fs.writeFileSync(dummyPath, 'fake image content');

    // Create a form
    const form = new FormData();
    form.append('founderImage', fs.createReadStream(dummyPath));
    form.append('siteName', 'Test Name');

    // We need an admin token. Where can we get it?
    // We might not have one, so we can't test unless we login first.
    console.log('We need to login first to get a token.');
    
    // Admin credentials from backend/.env
    const loginRes = await axios.post('https://jannat-backend-azwb.onrender.com/api/users/login', {
      email: 'azeemansari@706891',
      password: 'Azeem@706891'
    });
    const token = loginRes.data.token;
    console.log('Logged in successfully!');

    // Now upload
    const res = await axios.put('https://jannat-backend-azwb.onrender.com/api/settings', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Upload successful!');
    console.log(res.data);
  } catch (err) {
    console.error('Upload failed!');
    console.error(err.response?.data || err.message);
  }
}

testUpload();
