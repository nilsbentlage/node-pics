function logThis(message) {
  const timeStamp = new Date().toISOString().slice(2, 19).replace("T", " ");
  console.log(`${timeStamp} | ` + message);
}

export default logThis;
