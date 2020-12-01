require('dotenv').config()

const Store = require('./functions/store')
const avalibleItems = require('./functions/availableItems')

const   TelegramBot = require('node-telegram-bot-api'),
        request     = require('request'),
        cheerio     = require('cheerio'),
        token       = process.env.TELEGRAM_TOKEN,
        bot         = new TelegramBot(token, { polling: true });

bot.onText(/\/find (.+)/, (msg, match) => {
  const resp = match[1];
  const URL_PACKAGE = `https://www.linkcorreios.com.br/?id=${resp}`;

  bot.sendMessage(msg.chat.id, '🔍 Aguarde ... ');

  request(URL_PACKAGE, (err, res, body) => {
    if (err) {
      console.log(err);
      bot.sendMessage(msg.chat.id, `⛔ O Serviço esta indisponível no momento!`);
    } else {
      const crawler = cheerio.load(body);

      const not_found = crawler('div.col-lg-8 > p').text().split(':');

      if (not_found[0] == 'O rastreamento não está disponível no momento') {

        bot.sendMessage(msg.chat.id, `⛔ O código ${resp} é invalido!`);

      } else {

        let data = '';

        crawler('ul.linha_status').each(function () {

          const icon = {
            Status: '🔍',
            Data: '⌚',
            Local: '🌏',
          };

          crawler(this)
            .find('li')
            .each(function () {

              let crawledText = crawler(this).text();

              let splittedCrawledText = crawledText.split(':');

              crawledText = `${icon[splittedCrawledText[0].trim()] + crawledText}`;

              data = `${data + crawledText}\n`;
            });

          data = `${data}\n`;
        });

        bot.sendMessage(msg.chat.id, data);

      }
    }
  });
});

bot.onText(/\/store (.+)/, async (msg, match) => {
  const resp = match[1];
  const items = await Store(resp)
  items.data.map((e)=>{
    if (e.enabled){
      bot.sendMessage(msg.chat.id,`📋 Nome: ${e.name} \n💲 Preço: ${e.cost} points`)
    }
  })
})

bot.onText(/\/avalibleItems (.+)/, async (msg, match) => {
  const infos = match[1].split(' ')
  const channel = infos[0].trim();
  const username = infos[1].trim();
  const data = await avalibleItems(channel,username)

  if(data[0] != false){

  //  console.log(data)

    await data[1].map((i)=>{
      if(i.cost <= data[0] && i.enabled){
        bot.sendMessage(msg.chat.id,`📋 Nome: ${i.name} \n💲 Preço: ${i.cost} points`)
      }
    }) 

  }else{
    bot.sendMessage(msg.chat.id,`⛔ Não foi possivel completar a ação! `)
  }
 
})