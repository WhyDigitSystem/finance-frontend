import CryptoJS from 'crypto-js';
import React from 'react';

export const encryptPassword = (password) => {
  console.log('Password', password);
  console.log(CryptoJS);
  let rkEncryptionKey = CryptoJS.enc.Base64.parse(process.env.REACT_APP_ENC_KEY);
  let rkEncryptionIv = CryptoJS.enc.Base64.parse(process.env.REACT_APP_ENC_IV);
  let utf8Stringified = CryptoJS.enc.Utf8.parse(password);
  let encrypted = CryptoJS.AES.encrypt(utf8Stringified.toString(), rkEncryptionKey, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: rkEncryptionIv
  });
  let encryptedPassword = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  return encryptedPassword;
};

export const renderHTML = (rawHTML) => React.createElement('div', { dangerouslySetInnerHTML: { __html: rawHTML } });
// export const checkIsAdmin = (userName, password) =>Admin.username === userName && Admin.password === password?true:false;
