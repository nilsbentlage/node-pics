"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logThis(message) {
    const timeStamp = new Date().toISOString().slice(2, 19).replace("T", " ");
    console.log(`${timeStamp} | ` + message);
}
exports.default = logThis;
