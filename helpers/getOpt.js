
export async function getOtpForUser(email) {
  const res = await fetch(`https://your-test-api.com/get-otp?email=${email}`);
  const data = await res.json();
  return data.otp; 
}
