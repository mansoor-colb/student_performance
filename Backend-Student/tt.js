var CryptoJS = require("crypto-js");
// Encrypt
var ciphertext = CryptoJS.AES.encrypt('rav24010190', 'secretthavells').toString();

// Decrypt
console.log(ciphertext)
var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secretthavells');
console.log(bytes)
var originalText = bytes.toString(CryptoJS.enc.Utf8);
console.log(originalText); // 'my message'