function logThis(message: string) {
  const timeStamp = new Date().toISOString().slice(2, 19).replace("T", " ");
  console.log(`${timeStamp} | ` + message);
}

export default logThis;
