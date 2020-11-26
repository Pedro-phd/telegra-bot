require('dotenv').config()

const   TelegramBot = require('node-telegram-bot-api'),
        request     = require('request'),
        cheerio     = require('cheerio'),
        token       = process.env.TELEGRAM_TOKEN,
        bot         = new TelegramBot(token, { polling: true });

bot.onText(/\/find (.+)/, (msg, match) => {
  const resp = match[1];
  const URL_PACKAGE = `https://www.linkcorreios.com.br/?id=${resp}`;

  bot.sendMessage(msg.chat.id,'🔍 Aguarde ... ')
  
      request(URL_PACKAGE, (err, res, body) => {
        if (err) {

          console.log(err);

        } else {

            const crawler = cheerio.load(body);

            const not_found = crawler('div.col-lg-8 > p').text().split(':')

            if(not_found[0] == "O rastreamento não está disponível no momento"){

                bot.sendMessage(msg.chat.id,`⛔ O código ${resp} é invalido!`)

            }else{
                crawler('ul.linha_status').each(function(index){
                    var status = crawler(this).find('li:nth-child(1)').text();
                    var data = crawler(this).find('li:nth-child(2)').text();
                    var local = crawler(this).find('li:nth-child(3)').text();
                    bot.sendMessage(msg.chat.id, `📦 Pacote: ${'\n🔍 ' + status + '\n⌚ ' + data + '\n🌏 ' + local}`)

                });  
            }
          }
        }
      );
});