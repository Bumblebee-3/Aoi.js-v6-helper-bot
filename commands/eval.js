const client = require("../index.js")
module.exports = {
  name: "eval",
  code: async (message) => {
    if(message.author.id!=require("../config.json").botOwnerId) return message.reply("You are not my owner!");
    const code = message.content.replace("bee eval ","");
    try{
      const c=eval("const client = require('../index.js');"+code);
      if(c.length>=2000){
        message.channel.send("TOO BIG")
      }
      if(c){
        message.channel.send("Evaluated ```\n"+c+"\n```")
      }
      else {
        message.channel.send("Evaluated")
      }
    }catch(e){
      message.channel.send("Error occoured: \`\`\`\n"+e+"\n\`\`\`")
    }
  },
  nonPrefixed: false
}