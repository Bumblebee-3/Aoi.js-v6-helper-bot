const { Client, Events, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, Collection } = require('discord.js');
const fs = require("fs")
const path = require("path")


module.exports = {
  code: async (client, bot) => {

    client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isStringSelectMenu()) return;

      if (interaction.customId === 'select') {
        var func = bot.functionManager.cache.get(interaction.values[0])
        if (!func) return await interaction.reply("Cannot find function `" + interaction.values[0] + "`!")
        const code = func.code.toString()
        var fcode = "";
        if (code.length >= 1024) {
          fcode = "File is too big to send in embed!"
        }
        else {
          fcode = code
        }



        function getUsage() {
          const lines = code.split("\n");
          var dat = lines.findIndex(x => x.includes("let ["));
          if(dat==-1){
            dat = lines.findIndex(x => x.includes("const ["))
          }
          const index = lines.findIndex(x => x.includes("inside.splits"));
          if (dat == index) {
            if (index != -1) {
              return "$" + interaction.values[0] + "[" + lines[index].split("[")[1].split("]")[0].replace(/,/g, ";") + "]".replace(/ /g, "");
            } else {
              return "Usage not found"
            }
          }
          else {
            let str = interaction.values[0] + "[";
            if(dat==-1)return "Usage not found!"

            for (var i = dat + 1; i < index; i++) {
              str = str + lines[i]
            }
            return str + "]".replace(/\t/g, "").replace(/ /g, "")
          }
        }
        let use = getUsage()

        const exampleEmbed = {
          color: 0x0099ff,
          title: 'Function Usage',

          description: `Function Usage of **__$${interaction.values[0]}__**`,

          fields: [
            {
              name: '**Usage:**',
              value: `\`\`\`${use}\`\`\``,
              inline: false,
            },
            {
              name: '**Code:**',
              value: `\`\`\`js\n${fcode}\n\`\`\``,
              inline: false,
            },

          ],
          timestamp: new Date().toISOString(),
        };
        let data = require("../data/a.json")
            for(i=0;i<data.length;i++){
              if(data[i].func==interaction.values[0]){
                exampleEmbed.url="https://aoi.js.org/docs/functions/"+(data[i].type.charAt(0).toUpperCase() + data[i].type.slice(1))+"/"+data[i].func
                exampleEmbed.fields.push({
              name: '**Type:**',
              value: `${data[i].type}`,
              inline: false,
            })
                exampleEmbed.fields.push({
              name: '**Link:**',
              value: `[${"https://aoi.js.org/docs/functions/"+(data[i].type.charAt(0).toUpperCase() + data[i].type.slice(1))+"/"+data[i].func}](${"https://aoi.js.org/docs/functions/"+(data[i].type.charAt(0).toUpperCase() + data[i].type.slice(1))+"/"+data[i].func})`,
              inline: false,
            })
              }
            }
        if (fcode == code) {
          await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
        }
        else {
          fs.appendFile(__dirname.replace("/autocommands", "") + "/data/" + interaction.values[0].replace("$", "") + ".js", code, function(err) {
            if (err) throw err;
            console.log('Saved!');
          });

          const attachment = new AttachmentBuilder(__dirname.replace("/autocommands", "") + "/data/" + interaction.values[0].replace("$", "") + ".js", { name: interaction.values[0].replace("$", "") + '.js' })

          await interaction.reply({ embeds: [exampleEmbed], ephemeral: true, files: [attachment] });

        }

      }
    })
  }
}
