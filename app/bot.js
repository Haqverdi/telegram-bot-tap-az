const Telegraf = require('telegraf');
const { GetLastAdv } = require('./scraper');

// create bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// start command
bot.command('start', ctx => {
  console.log(ctx.from.first_name);
  // reply greet msg
  ctx.reply(
    `Salam, ${ctx.from.first_name} mən tap.az-dan yeni ev elanı olduqca onu sənə gondərəcəm.`
  );
  // recursion settime out every 1 min
  setTimeout(async function repeatFunc() {
    // await data from tap.az
    const advData = await GetLastAdv();
    // if new data avaliable send
    if (advData) {
      ctx.reply(`Qiymet: ${advData.advPrice}, ${advData.advLink}`);
    }
    // run func after 1 min
    setTimeout(repeatFunc, 60000);
    return;
  }, 60000);
});

// default hears reply
bot.hears(RegExp(/^.*/g), ctx => {
  ctx.reply(`Üzr istəyirəm ${ctx.from.first_name}, amma nəyi nəzərdə tutduğunuzu anlamıram hələki :(`);
});

// error handler
bot.catch(err => {
  console.log('Ooops ', err);
});

// start
bot.startPolling();
