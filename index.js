import marked from 'marked'

import html from 'raw-loader!./index.html'
import config from './config.json'

import HOW_UNKNOW from 'raw-loader!./src/md/how/UNKNOW.md'
import WHY_UNKNOW from 'raw-loader!./src/md/why/UNKNOW.md'

import HOW_1XXX from 'raw-loader!./src/md/how/1XXX.md'
import WHY_1XXX from 'raw-loader!./src/md/why/1XXX.md'

async function generror(request) {
    const req = request
    const urlStr = req.url
    const urlObj = new URL(urlStr)
    const path = urlObj.href.substr(urlObj.origin.length)
    const domain = (urlStr.split('/'))[2]
    const sq = (key) => {
        return urlObj.searchParams.get(key)
    }
    const lang = config.i18n.zh_CN
    let n = {}
    let HOW = ''
    let WHY = ''
    let TOKEN = ''
    console.log(sq('error'))
    switch (sq('error')) {
        case '1XXX':
            n = lang["1XXX"]
            TOKEN = "::CLOUDFLARE_ERROR_1000S_BOX::"
            HOW = HOW_1XXX
            WHY = WHY_1XXX
            break;
        default:
            n = lang["UNKNOW"]
            HOW = HOW_UNKNOW
            WHY = WHY_UNKNOW

    }
    return genhtml(html
        .replace(/<!--TITLE-->/g, n.TITLE)
        .replace(/<!--CODE-->/g, n.CODE)
        .replace(/<!--RES-->/g, lang.RES)
        .replace(/<!--TOKEN-->/g, TOKEN?TOKEN:"没有更多的信息")
        .replace(/<!--SIMPLR_DES-->/g, n.SIMPLR_DES)

        .replace(/<!--WEB_BLOCK_STATUS-->/g, n.WEB_STATUS ? config.WORKING_BLOCK : config.WORKING_BLOCK_WITH_ERROR)
        .replace(/<!--WEB_STATUS-->/g, n.WEB_STATUS ? config.STATUS_WORKING : config.STATUS_WORKING_WITH_ERROR)
        .replace(/<!--WEB_STATUS_DES-->/g, n.WEB_STATUS ? lang.WORKING : n.WEB_ERROR)
        .replace(/<!--CLIENT-->/g, lang.CLIENT)


        .replace(/<!--EDGE_BLOCK_STATUS-->/g, n.EDGE_STATUS ? config.WORKING_BLOCK : config.WORKING_BLOCK_WITH_ERROR)
        .replace(/<!--EDGE_STATUS-->/g, n.EDGE_STATUS ? config.STATUS_WORKING : config.STATUS_WORKING_WITH_ERROR)
        .replace(/<!--EDGE_STATUS_DES-->/g, n.EDGE_STATUS ? lang.WORKING : n.EDGE_ERROR)
        .replace(/<!--EDGE-->/g, lang.EDGE)


        .replace(/<!--SERVER_BLOCK_STATUS-->/g, n.SERVER_STATUS ? config.WORKING_BLOCK : config.WORKING_BLOCK_WITH_ERROR)
        .replace(/<!--SERVER_STATUS-->/g, n.SERVER_STATUS ? config.STATUS_WORKING : config.STATUS_WORKING_WITH_ERROR)
        .replace(/<!--SERVER_STATUS_DES-->/g, n.SERVER_STATUS ? lang.WORKING : n.SERVER_ERROR)
        .replace(/<!--SERVER-->/g, lang.SERVER)

        .replace(/<!--SIMPLR_WHY-->/g, lang.SIMPLR_WHY)
        .replace(/<!--SIMPLR_HOW-->/g, lang.SIMPLR_HOW)


        .replace(/<!--WHY-->/g, marked(WHY))
        .replace(/<!--HOW-->/g, marked(HOW))


        .replace(/<!--PROVIDER-->/g, lang.PROVIDER)
        .replace(/<!--PROVIDER_URL-->/g, lang.PROVIDER_URL)

        .replace(/<!--YOUR_IP-->/g, lang.YOUR_IP)
        .replace(/<!--YOUR_REQID-->/g, lang.YOUR_REQID)
    )
}

const genhtml = (html) => {
    return new Response(html, {
        status: 200, headers: {
            "Content-Type": "text/html; charset=utf-8"
        },
    })
}
addEventListener("fetch", async event => {
    event.respondWith(generror(event.request))
})

