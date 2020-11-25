const TelegramBot = require("node-telegram-bot-api")
const request = require('request')
const cheerio = require('cheerio')

const token = "1318632592:AAFdYdYwxGK_f-FmhR7dLJoqY4aIE2Hlyx4"

const bot = new TelegramBot( token, { polling: true } )

const chatId = "298493513"

const URL = "https://www.linkcorreios.com.br/?id=BR041995267BR"

bot.getChat(chatId).then(function (msg) {

    bot.on('message', (msg) => {
        const txtMsg = msg.text.toString().toLowerCase()
        if (txtMsg == "email") {

        bot.sendMessage(msg.chat.id,"Você escolheu a opção email!");
        } 
        if(txtMsg == "find"){
            bot.sendMessage(msg.chat.id,"Digite o código do pacote!");
            bot.on('message', (package) => {
                const cod = package.text.toString().toLowerCase()
                const URL_PACKAGE = `https://www.linkcorreios.com.br/?id=${cod}`
                request(URL_PACKAGE,(err,res,body) => {
                    if(err){
                        console.log(err)
                    }else{
                        const craweler = cheerio.load(body)
                        craweler('ul.linha_status:nth-child(2)').each(function(index){
                            var status = craweler(this).find('li:nth-child(1)').text();
                            var data = craweler(this).find('li:nth-child(2)').text();
                            var local = craweler(this).find('li:nth-child(3)').text();
                            bot.sendMessage(msg.chat.id,`${'\n' + status + '\n' + data + '\n' + local}`)
                            console.log("✔ Response Send!");
                        });      
                    }
                })
            })
            
        }
        
     })

});
