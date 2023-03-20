const { AoiClient } = require("aoi.js");
function createAoiClient(){
  const bot = new AoiClient({
    "token": process.env["token"],
    "prefix": ["bee "],
    "intents": ["MessageContent", "Guilds", "GuildMessages"],
    "events": ["onMessage", "onInteractionCreate"]
  })
  return bot;
}
module.exports = {createAoiClient}