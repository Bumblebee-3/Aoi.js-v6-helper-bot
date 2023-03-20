function handleCode(){
  const server = require("./server.js");
  const client = require("./aoiClient.js");
  server.createServer();
  const bot = client.createAoiClient();
  return bot
}
module.exports = {
  handleCode
}