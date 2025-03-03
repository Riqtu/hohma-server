import { Telegraf } from "telegraf";

const randomCommand = (bot: Telegraf) => {
  bot.command("random", (ctx) => {
    const answer = Math.random() > 0.5 ? "Да" : "Нет";
    ctx.reply(answer);
  });
};

export default randomCommand;
