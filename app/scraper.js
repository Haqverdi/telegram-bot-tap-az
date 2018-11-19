const fs = require('fs');
const axios = require('axios');
const $ = require('cheerio');
const tap_az_main_url = 'https://tap.az';
const tap_az_url =
  'https://tap.az/all/real-estate/apartments?utf8=%E2%9C%93&log=true&keywords=&q%5Bregion_id%5D=&order=&q%5Buser_id%5D=&q%5Bcontact_id%5D=&q%5Bprice%5D%5B%5D=250&q%5Bprice%5D%5B%5D=330&p%5B740%5D=&p%5B747%5D=&p%5B737%5D%5B%5D=&p%5B737%5D%5B%5D=&p%5B736%5D%5B%5D=&p%5B736%5D%5B%5D=';

//save last adv time
let lastAdvTime = '';

// get and export first adv details
exports.GetLastAdv = function() {
  return new Promise(async (resolve, reject) => {
    try {
      // html from get request
      const { data } = await axios.get(tap_az_url);
  
      // last adv html
      const firstAdvHtml = $(data)
        .find('.products-i')
        .first()
        .html();
  
      // adv added time
      const AdvAddedTime = $('.products-link > .products-created', firstAdvHtml).text();
      // compare added time with aur last saved ads time
      if (lastAdvTime === AdvAddedTime) {
        resolve(false);
      } else {

        // adv link
        const advLink = tap_az_main_url + $('.products-link', firstAdvHtml).attr('href');

        // adv price
        const advPrice =
        $('.products-link .price-val', firstAdvHtml).text() 
        + ' ' +
        $('.products-link .price-cur', firstAdvHtml).text();
        // change last time in memory
        lastAdvTime = AdvAddedTime;
        resolve({ advLink, advPrice });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};