import marked from 'marked'

import html from 'raw-loader!./index.html'
import config from './config.json'

import HOW_UNKNOW from 'raw-loader!./src/md/how/UNKNOW.md'
import WHY_UNKNOW from 'raw-loader!./src/md/why/UNKNOW.md'

import HOW_1XXX from 'raw-loader!./src/md/how/1XXX.md'
import WHY_1XXX from 'raw-loader!./src/md/why/1XXX.md'

import HOW_5XX from 'raw-loader!./src/md/how/5XX.md'
import WHY_5XX from 'raw-loader!./src/md/why/5XX.md'

import HOW_BAN from 'raw-loader!./src/md/how/BAN.md'
import WHY_BAN from 'raw-loader!./src/md/why/BAN.md'

import HOW_DOWN from 'raw-loader!./src/md/how/DOWN.md'
import WHY_DOWN from 'raw-loader!./src/md/why/DOWN.md'

import HOW_CAP from 'raw-loader!./src/md/how/CAP.md'
import WHY_CAP from 'raw-loader!./src/md/why/CAP.md'

import HOW_5S from 'raw-loader!./src/md/how/5S.md'
import WHY_5S from 'raw-loader!./src/md/why/5S.md'

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
    switch (sq('error')) {
        case '1XXX':
            n = lang["1XXX"]
            TOKEN = "::CLOUDFLARE_ERROR_1000S_BOX::"
            HOW = HOW_1XXX
            WHY = WHY_1XXX
            break;
        case '5XX':
            n = lang["5XX"]
            TOKEN = "::CLOUDFLARE_ERROR_500S_BOX::"
            HOW = HOW_5XX
            WHY = WHY_5XX
            break;
        case '5S':
            n = lang["5S"]
            HOW = HOW_5S
            WHY = WHY_5S
            break;
        case 'IP_BAN':
            n = lang["IP_BAN"]
            HOW = HOW_BAN
            WHY = WHY_BAN
            break;
        case 'AO':
            n = lang["AO"]
            HOW = HOW_DOWN
            WHY = WHY_DOWN
            TOKEN = '::ALWAYS_ONLINE_NO_COPY_BOX::'
            break;
        case 'CAP':
            n = lang["CAP"]
            HOW = HOW_CAP
            WHY = WHY_CAP
            break;
        case 'WAF_BAN':
            n = lang["WAF_BAN"]
            HOW = HOW_BAN
            WHY = WHY_BAN
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
        .replace(/<!--TOKEN-->/g, TOKEN ? TOKEN : "没有更多的信息")
        .replace(/<!--SIMPLR_DES-->/g, n.SIMPLR_DES)

        .replace(/<!--WEB_BLOCK_STATUS-->/g, gen_card(n.WEB_STATUS))
        .replace(/<!--WEB_STATUS-->/g, gen_text(n.WEB_STATUS))
        .replace(/<!--WEB_STATUS_DES-->/g, n.WEB_STATUS === 0 ? lang.WORKING : n.WEB_ERROR)
        .replace(/<!--CLIENT-->/g, lang.CLIENT)


        .replace(/<!--EDGE_BLOCK_STATUS-->/g, gen_card(n.EDGE_STATUS))
        .replace(/<!--EDGE_STATUS-->/g, gen_text(n.EDGE_STATUS))
        .replace(/<!--EDGE_STATUS_DES-->/g, n.EDGE_STATUS === 0 ? lang.WORKING : n.EDGE_ERROR)
        .replace(/<!--EDGE-->/g, lang.EDGE)


        .replace(/<!--SERVER_BLOCK_STATUS-->/g, gen_card(n.SERVER_STATUS))
        .replace(/<!--SERVER_STATUS-->/g, gen_text(n.SERVER_STATUS))
        .replace(/<!--SERVER_STATUS_DES-->/g, n.SERVER_STATUS === 0 ? lang.WORKING : n.SERVER_ERROR)
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

const gen_card = (n) => {
    switch (n) {
        case 0:
            return config.WORKING_BLOCK
        case 1:
            return config.WORKING_BLOCK_WITH_ISSUE
        case 2:
            return config.WORKING_BLOCK_WITH_ERROR
        default:
            return config.WORKING_BLOCK_WITH_ERROR
    }
}

const gen_text = (n) => {
    switch (n) {
        case 0:
            return config.STATUS_WORKING
        case 1:
            return config.STATUS_WORKING_WITH_ISSUE
        case 2:
            return config.STATUS_WORKING_WITH_ERROR
        default:
            return config.STATUS_WORKING_WITH_ERROR
    }
}

addEventListener("fetch", async event => {
    event.respondWith(generror(event.request))
})

