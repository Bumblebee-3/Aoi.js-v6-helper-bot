const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async function(fd, message) {
  const resp = await fetch('https://aoijs-api.bumblebeerox1.repl.co/api/aoijs/function?name=' + fd.functions[0]);
  const data = await resp.json();
  

  

  var exampleEmbed = {
    color: 0x0099ff,
    title: 'Function Usage of ' + fd.functions[0],

    description: `${data.desc}`,

    fields: [
      {
        name: '**Usage:**',
        value: `\`\`\`${data.usage}\`\`\``,
        inline: false,
      }, {
        name: '**Example:**',
        value: `${data.example}`,
        inline: false,
      }
    ],
    timestamp: new Date().toISOString(),
  };
  //console.log(data)
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setURL(data.link)
        .setLabel('Docs!')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL(data.src)
        .setLabel('Source Code!')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel('⏩ Next: '+fd.functions[1])
        .setStyle(ButtonStyle.Primary)
    );
  message.reply({ embeds: [exampleEmbed], components: [row] }).then(function(msg){
    const db = JSON.parse(require("fs").readFileSync(process.cwd() + "/database/data.json"));
  db.push({"msg":msg.id,"funcs":fd.functions,"current":0})
  require("fs").writeFileSync(process.cwd() + "/database/data.json", JSON.stringify(db));
  });
}