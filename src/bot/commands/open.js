const openCommand = (bot) => {
  bot.command("open", (ctx) => {
    const webAppUrl = process.env.WEB_APP_URL;

    ctx.reply("👋 Добро пожаловать в Хохму!", {
      reply_markup: {
        inline_keyboard: [[{ text: "🚀 Открыть Хохму", url: webAppUrl }]],
      },
    });
  });
};

export default openCommand;
