const QRCode = require('qrcode');

const generateQR = async (text) => {
  try {
    const qr = await QRCode.toDataURL(text, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qr;
  } catch (error) {
    console.error('QR generation error:', error);
    throw error;
  }
};

module.exports = { generateQR };

