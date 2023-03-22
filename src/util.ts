import { Response } from "express";

function logThis(message: string, res?: Response) {
  const timeStamp = new Date().toISOString().slice(2, 19).replace("T", " ");
  console.log(`${timeStamp} | ` + message);
  if (res) res.send(`${timeStamp} | ` + message);
}

export default logThis;
