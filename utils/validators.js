const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);
  return lat >= -90 && lat <= 90 && long >= -180 && long <= 180;
};

const isValidDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today && !isNaN(date.getTime());
};

const isValidTime = (timeStr) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeStr);
};

const isValidMobileNumber = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.toString());
};

const isValidPassword = (password) => {
  return password && password.length >= 8;
};

module.exports = {
  isValidEmail,
  isValidCoordinates,
  isValidDate,
  isValidTime,
  isValidMobileNumber,
  isValidPassword
};
