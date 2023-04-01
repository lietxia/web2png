const puppeteer = require('puppeteer-core');
const http = require('http');
const argv = process.argv;
var cid = 14, gid = 962558609, rand = 1, cls = 1,
    url = "http://127.0.0.1:5700/";
if (argv.length >= 6) {
    cid = argv[2];
    gid = argv[3];
    rand = argv[4];
    cls = argv[5] > 1 ? parseInt(argv[5]) : 1;
    url += `send_group_msg?group_id=${gid}&message=[CQ:image,file=file:///home/wwwroot/default/png/team/${cid}_${rand}_${cls}.png][CQ:image,file=file:///home/wwwroot/default/png/team/${cid}_${rand}_${cls}_2.png]`;
} else {
    throw new Error("need 5 args");
}

(async () => {
    const browser = await puppeteer.launch({
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--single-process'
        ],
        headless: true,
        executablePath: "/usr/bin/google-chrome"
        // headless: false,
        // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });
    const page = await browser.newPage();
    await page.setViewport(
        {
            width: 900,
            height: 200,
            //deviceScaleFactor: 1.3
        });
    await page.goto(`https://cdn.r-mj.com/?cid=${cid}#!ranking_Log_${rand}`).catch(
        err => console.log(err)
    );
    await page.waitForSelector('table>tr', {
        timeout: 5000
    })
    await page.evaluate(`
        let table = document.querySelectorAll('table.bordered');
        table=table[${cls - 1}];
        table.style.cssText="margin:15px auto;width: 95%;";
        var span = document.createElement("span");
        span.appendChild(table);
        document.getElementById('nav').hidden = true;
        document.getElementById('banner').hidden = true;
        document.getElementById('display').innerText = '';
        document.getElementById('display').appendChild(span);
        `);
    try {
        await page.screenshot({
            path: `./team/${cid}_${rand}_${cls}.png`,
            fullPage: true,
            captureBeyondViewport: false
        }).catch(err => {
            console.log('截图失败');
            console.log(err);
        });
    } catch (e) {
        console.log('执行异常');
    };
    await page.goto(`https://cdn.r-mj.com/?cid=${cid}#!rankingChart${rand}`).catch(
        err => console.log(err)
    );
    await page.waitForSelector('.charts', {
        timeout: 3000
    })
    await page.evaluate(`
        let charts = document.getElementsByClassName('charts');
        charts=charts[${cls - 1}];
        let h2=document.getElementsByTagName('h2');
        h2=h2[${cls - 1}];
        var span = document.createElement("span");
        span.appendChild(h2);
        span.appendChild(charts);
        document.body.innerText = '';
        document.body.appendChild(span);
        `);
    try {
        await page.screenshot({
            path: `./team/${cid}_${rand}_${cls}_2.png`,
            fullPage: true,
            captureBeyondViewport: false
        }).catch(err => {
            console.log('截图失败');
            console.log(err);
        });
    } catch (e) {
        console.log('执行异常');
    }
    finally {
        http.get(url);
    }
    await browser.close();
    return;
})();