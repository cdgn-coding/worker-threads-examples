const { chromium } = require('playwright');
const { parentPort, workerData = {} } = require('node:worker_threads');

const linkSet = {};

async function extractLinks(page) {
  const links = await page.$$eval('.tkt-artist-list a.info-container', (elements) => elements.map((element) => element.href));

  const filtered = links.filter((link) => !linkSet[link]);
  filtered.forEach((link) => linkSet[link] = true);

  if (filtered.length > 0) {
    parentPort.postMessage({
      type: 'links',
      payload: filtered,
    }); 
  }

  return filtered;
}

async function main() {
  const {
    url = 'https://www.ticketek.com.ar/buscar/',
    inactivityTimeout = 15000,
    defaultWaitForTimeout = 5000,
  } = workerData;

  // Setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to Ticketek...');
  await page.goto(url)
  await page.waitForTimeout(defaultWaitForTimeout);

  console.log('Extracting links...');
  await extractLinks(page);

  console.log('Clicking on "Ver más" button...');
  await page.click('.infinite-scroll.refresh > span');
  await page.waitForTimeout(defaultWaitForTimeout);

  let latestLinks = Date.now();
  while (true) {
    console.log('Scrolling...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(defaultWaitForTimeout);
    
    console.log('Extracting links...');
    const links = await extractLinks(page);

    if (links.length > 0) {
      console.log('New links found:', links.length);
      latestLinks = Date.now();
    } else {
      const secondsSinceLatestLinks = (Date.now() - latestLinks) / 1000;
      console.log('No new links found since', secondsSinceLatestLinks, 'seconds')
    }

    if (Date.now() - latestLinks > inactivityTimeout) {
      console.log('No new links in the last 15 seconds, exiting loop');
      break;
    }
  }

  // Teardown
  await context.close();
  await browser.close();

  parentPort.postMessage({
    type: 'finish',
  });
}

main();