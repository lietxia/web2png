const puppeteer = require('puppeteer-core');
const http = require('http');
const argv = process.argv;
var index = 1, url = "http://127.0.0.1:5701/";
if (argv.length >= 5) {
    index = (argv[2] > 1) ? argv[2] : 1;
    if (argv[3] == "g") {
        url += `send_group_msg?group_id=${argv[4]}&message=`;
    } else {
        url += `send_private_msg?user_id=${argv[4]}&message=`;
    }
    url += '刷新完成，注意这个是刷新排行榜，个人面板成绩和此命令无关';
} else {
    throw new Error("need 5 args");
}

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: "/usr/bin/google-chrome" //"/usr/bin/chromium-browser",
        //args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 800 });
    let request_url = `https://rate.000.mk/#/${index}/level/`;

    await page.goto(request_url).catch(
        err => console.log(err)
    );
    await page.waitForXPath('//*[@id="table1"]/tbody/tr[1]', { timeout: 10000 });

    await page.evaluate(() => {
        document.querySelector("nav").remove();
    });
    if (index == 1) {
        await page.evaluate(() => {
            var tgt = document.querySelectorAll("#table1>tbody>tr");
            for (var i = tgt.length - 1; i >= 150; i--) {
                tgt[i].remove();
            }
        });
    }

    try {
        let table = await page.$('#table1');
        await table.screenshot({
            path: `rate_${index}.png`,
            // fullPage: true
        }).catch(err => {
            console.log('截图失败');
            console.log(err);
        });
    } catch (e) {
        console.log('执行异常');
    } finally {
        console.log(url);
        http.get(url);
    }
    await browser.close();
})();