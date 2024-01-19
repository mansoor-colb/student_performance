var CryptoJS = require("crypto-js");
var bytes  = CryptoJS.AES.decrypt("U2FsdGVkX18Z40MIn0feUiNIHpjQefv/rhXRBFI9LEg=", 'secret key 123');
console.log(bytes)
var originalText = bytes.toString(CryptoJS.enc.Utf8);
console.log(originalText); 