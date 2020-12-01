const axios = require("axios");

async function Store(channel){

    let channelId = ''

    const data = await axios.get(`https://api.streamelements.com/kappa/v2/channels/${channel}`)
    const items = await axios.get(`https://api.streamelements.com/kappa/v2/store/${data.data._id}/items`)
    return items
}

module.exports = Store