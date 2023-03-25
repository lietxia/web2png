const puppeteer = require('puppeteer-core');
const http = require('http');
const argv = process.argv;
var cid = 14, gid = 962558609, name = 'Hibiki',
    url = "http://127.0.0.1:5701/";
if (argv.length >= 5) {
    cid = (argv[2] > 1) ? argv[2] : 1;
    gid = argv[3];
    name = argv[4];
    url += `send_group_msg?group_id=${gid}&message=[CQ:image,file=file:///home/wwwroot/default/png/person/${cid}_${name}.png]`;
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
    await page.setViewport({ width: 770, height: 600 });
    let request_url = `https://rate.000.mk/chart/?area=${cid}&name=${name}`;

    await page.goto(request_url).catch(
        err => console.log(err)
    );
    try {
        await page.waitForSelector('#image_loaded', {
            timeout: 10000
        });
        await page.screenshot({
            path: `./person/${cid}_${name}.png`,
            // fullPage: true
        }).catch(err => {
            console.log('截图失败');
            console.log(err);
        });
    } catch (e) {
        console.log('执行异常');
    } finally {
        http.get(url);
    }
    await browser.close();
    return;
})();