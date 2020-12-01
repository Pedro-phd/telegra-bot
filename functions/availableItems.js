const axios = require("axios");
async function avalibleItems(channel,user){

    try {

        const channelID = await axios.get(`https://api.streamelements.com/kappa/v2/channels/${channel}`)
        const items = await axios.get(`https://api.streamelements.com/kappa/v2/store/${channelID.data._id}/items`)
        const userData = await axios.get(`https://api.streamelements.com/kappa/v2/points/${channelID.data._id}/${user}`)
    
        return[userData.data.points,items.data]

    } catch (error) {
        return [false,error]
    }
    

    
}

module.exports = avalibleItems