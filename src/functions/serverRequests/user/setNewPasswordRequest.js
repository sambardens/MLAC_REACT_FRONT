import axios from 'axios';

async function setNewPasswordRequest(currentUrl, newPassword) {
  const [firstPart, token] = currentUrl.split('=');
  const data = JSON.stringify(newPassword);

  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/users/newPassword?token=${token}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res;
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

export default setNewPasswordRequest;
