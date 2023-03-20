const { Client, Events, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, Collection } = require('discord.js');
const fs = require("fs")
const path = require("path")


module.exports = {
  code: async (message, bot) => {
    if (message.content.startsWith("$") || (message.content.includes("\`\`\`") && message.content.includes("$"))) {
      var s1 = 0;
      var s2 = 0;
      var s3 = 0;
      var s4 = 0;
      var s5 = 0;
      var s6 = 0;
      for (i in message.content.split("")) {
        if (message.content.split("")[i] == "]") {
          s2 += 1
        }
        else if (message.content.split("")[i] == "[") {
          s1 += 1
        }
        else if (message.content.split("")[i] == "}") {
          s4 += 1
        }
        else if (message.content.split("")[i] == "{") {
          s3 += 1
        }
        else if (message.content.split("")[i] == ")") {
          s6 += 1
        }
        else if (message.content.split("")[i] == "(") {
          s5 += 1
        }
      }
      if (s1 != s2 || s3 != s4 || s5 != s6) {
        return message.channel.send("Brackets are not proper!")
      }
      var f = bot.functionManager.findFunctions(message.content.replace(/\`\`\`/g, ""))
      if (f.length >= 2) {
        //console.log(f)
        var mstring = "";
        var custom_options = [];
        for (let i = 0; i < f.length; i++) {
          if (mstring.includes(f[i])==true) continue;
          else {
            mstring = mstring + f[i] + "\n"
            custom_options[i] = {
              label: `${f[i]}`,
              description: `Get Usage of ${f[i]}`,
              value: `${f[i].replace("$", "")}`,
            }
          }
        }
        const exampleEmbed = {
          color: 0x0099ff,
          title: "Multiple Functions Found!",

          description: `Multiple Functions Were found in your input!`,

          fields: [
            {
              name: '**Functions List:**',
              value: `\`\`\`${mstring}\`\`\``,
              inline: false,
            }

          ],
          timestamp: new Date().toISOString(),
        };

        const row = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('select')
              .setPlaceholder('Select a function')
              .addOptions(custom_options),
          );
        message.reply({ embeds: [exampleEmbed], components: [row] });

      }
      else {
        if (!f[0]) return message.channel.send("Cannot find function `" + message.content + "`!")
        var func = bot.functionManager.cache.get(f[0].replace("$", ""))
        if (!func) return message.channel.send("Cannot find function `" + f[0] + "`!")
        const code = func.code.toString()
        var fcode = "";
        if (code.length >= 1024) {
          fcode = "File is too big to send in embed!"
        }
        else {
          fcode = code
        }


        function getUsage() {
          const lines = code.split("\n")
          var dat = lines.findIndex(x => x.includes("let ["));
          if(dat==-1){
            dat = lines.findIndex(x => x.includes("const ["))
          }
          
          
          const index = lines.findIndex(x => x.includes("inside.splits"));
          if (dat == index) {
            if (index != -1) {
              return f[0] + "[" + lines[index].split("[")[1].split("]")[0].replace(/,/g, ";") + "]".replace(/ /g, "");
            } else {
              return "Usage not found"
            }
          }
          else {
            
            let str = f[0] + "[";
            if(dat==-1)return "Usage not found!"
            for (var i = dat + 1; i < index; i++) {
              str = str + lines[i]
            }
            return str + "]"
          }
        }
        let use = getUsage()

        var exampleEmbed = {
          color: 0x0099ff,
          title: 'Function Usage',

          description: `Function Usage of **__${f[0]}__**`,

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
              if(data[i].func==f[0].replace("$","")){
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
          message.reply({ embeds: [exampleEmbed] });
        }
        else {
          fs.appendFile(__dirname.replace("/autocommands", "") + "/data/" + f[0].replace("$", "") + ".js", code, function(err) {
            if (err) throw err;
            console.log('Saved!');
          });

          const attachment = new AttachmentBuilder(__dirname.replace("/autocommands", "") + "/data/" + f[0].replace("$", "") + ".js", { name: f[0].replace("$", "") + '.js' })
          message.reply({ embeds: [exampleEmbed] });
          message.channel.send({ files: [attachment] })
        }

      }

    }
  }
}