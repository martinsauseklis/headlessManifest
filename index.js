const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs');
const http = require('http');
const fetch = require('node-fetch');
const { text } = require('stream/consumers');
const request = require('request-promise');
const path = require('path');
const { stdout } = require('process');

const {gzip, ungzip} = require('node-gzip');







(async () => {
    const browser = await puppeteer.launch({
      
      headless: true,
    
      defaultViewport: {width: 1920, height: 1080}
  });


    const page = await browser.newPage();
    

    await page.goto('https://ms3.dhl.com');

    

    const username = await page.evaluate(() => {
        document.getElementsByName("username")[0].value = 'alunde';
        document.getElementsByName("password")[0].value = "Kapecnenem@1973";
        document.getElementsByName("country")[0].value = "LV";
        
      });
    await page.click('[name="imgLogin"]', {clickCount: 1});
    await page.waitForTimeout(2000);

    const movement = await page.evaluate(() => {

      const today = new Date()
const tomorrow = new Date(today)
//tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setDate(tomorrow.getDate()) // so nemam ara

const dd = String(tomorrow.getDate()).padStart(2, '0');
const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
const yyyy = tomorrow.getFullYear();
const date = dd+'/' + mm+'/'+yyyy;
      document.getElementsByName('body1')[0].contentDocument.getElementsByName('org_loc')[0].value = "RIX";
      document.getElementsByName('body1')[0].contentDocument.getElementsByName('dest_loc')[0].value = "POZ";
      document.getElementsByName('body1')[0].contentDocument.getElementsByName('glob_prod_code')[0].value ='';
      document.getElementsByName('body1')[0].contentDocument.getElementsByName('dept_date')[0].value = date;
      document.getElementsByName('body1')[0].contentDocument.getElementsByName('domestic')[0].checked = false;
  });

    const frames = await page.frames();

    const currFrame = frames.find(f => f.name() === "body1")

    
    await currFrame.click('[title="Movement Query"]', {clickCount: 1}); 

   
    await page.waitForTimeout(2000);

 
    await currFrame.waitForSelector('[id="checkbox0"]');
    await currFrame.click('[id="checkbox0"]', {clickCount: 1});

    const move2 = await page.evaluate(() => {
       
       document.querySelector('[name="body1"]').contentDocument.getElementsByName('eta_time1')[0].value = '00';
      
   });

    await currFrame.waitForSelector('[title="Click here to view manifest"]');

    await currFrame.click('[title="Click here to view manifest"]', {clickCount: 1}); 
    
  

    
    await page.waitForTimeout(2000);

    await currFrame.waitForSelector('[name="downloadName"]');

    await currFrame.click('[name="downloadName"]', {clickCount: 1}); 
    await page.waitForTimeout(2000);
    const pages = await browser.pages();

    const popup = pages[pages.length-1];

    await popup.waitForSelector('input[value="X"]');
    await popup.click('input[value="X"]', {clickCount: 1});
    await page.setRequestInterception(true)
    await page.on('request', async req => {
      

     await fetch(req.url(), {url: req.url(), headers: req.headers()}).then(async res =>  {

      
       const result = await res.buffer();

       

       

       await ungzip(result).then(async res => await fs.writeFile('file.xml', res.toString(), () => console.log('done')))

      })


      
  })
    
    // await popup.client().send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: path.dirname('./')})
    
    await popup.click('[title="Click here to reset the fields in the page."]', {clickCount: 1});
    
    

    // await fs.writeFile('file.gz', async () => await page.on('response', res => res.buffer()))
    // const fileDownload = await popup.evaluate(() => {
      
    //   document.querySelector('[title="Click here to reset the fields in the page."]').click();
      
      
    // })

    

    

    
  
    
    await page.waitForNetworkIdle();
   
    
  
   
    
    
    
    
    
    

  
    // await page.waitForTimeout(2000);
    // await popup.screenshot({ path: 'example.png' });

    //await browser.close();
  })();


//   document.getElementsByName("username")[0].value = alunde;
// 	document.getElementsByName("password")[0].value = "Kapecnenem@1973";
// 	document.getElementsByName("country")[0].value = "LV";
