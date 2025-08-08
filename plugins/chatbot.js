const axios = require("axios");
const { cmd } = require("../command");

global.chatbotToggles = global.chatbotToggles || {};
global.userChats = global.userChats || {};

// Command: .chatbot on / off
cmd({
  pattern: "chatbot",
  alias: [],
  desc: "Enable or disable AI chatbot for this chat",
  category: "ai",
  use: ".chatbot on / off",
  react: "🤖",
  filename: __filename,
}, async (conn, m, msg, { text }) => {
  const chatId = m.chat;
  const arg = text?.trim()?.toLowerCase();
  const sender = m.sender;

  if (arg !== "on" && arg !== "off") {
    return m.reply("*Usage:* `.chatbot on` or `.chatbot off`");
  }

  chatbotToggles[chatId] = arg === "on";
  const status = arg === "on" ? "🟢 ENABLED" : "🔴 DISABLED";

  const replyText = `
╭── 「 🤖 *CHATBOT TOGGLE* 」
│
├ 🔧 Status: ${status}
├ 🧑‍💻 Controlled by: @${sender.split("@")[0]}
│
╰── Chatbot will now ${arg === "on" ? "respond" : "stop"} in this chat.
`.trim();

  await conn.sendMessage(chatId, {
    text: replyText,
    contextInfo: {
      mentionedJid: [sender]
    }
  }, { quoted: m });
});

// Handle non-command messages
cmd({
  pattern: "non_command_chatbot",
  onlyOnMessage: true,
  react: false,
  filename: __filename
}, async (conn, m, msg) => {
  const chatId = m.chat;
  const sender = m.sender;
  const text = m.text;

  if (!chatbotToggles[chatId]) return; // chatbot not enabled in this chat
  if (!text || m.key?.fromMe || m.text.startsWith(".")) return; // ignore empty, self, or commands

  // In group: only respond when mentioned or replied to bot
  if (msg.isGroup) {
    const ctx = msg.msg?.contextInfo || {};
    const mentioned = ctx?.mentionedJid?.includes(conn.user?.id);
    const replied = ctx?.participant === conn.user?.id;
    if (!mentioned && !replied) return;
  }

  // Chat memory
  if (!userChats[sender]) userChats[sender] = [];
  userChats[sender].push(`User: ${text}`);
  if (userChats[sender].length > 10) userChats[sender].shift();

  const prompt = `
You are Popkid AI, a friendly WhatsApp bot.

Conversation History:
${userChats[sender].join("\n")}
  `.trim();

  try {
    const { data } = await axios.get("https://mannoffc-x.hf.space/ai/logic", {
      params: {
        q: text,
        logic: prompt
      }
    });

    const botReply = data?.result?.trim();
    if (!botReply) return;

    userChats[sender].push(`Bot: ${botReply}`);
    await conn.sendMessage(chatId, {
      text: botReply
    }, { quoted: m });

  } catch (e) {
    console.error("AI error:", e);
    await m.reply("⚠️ Failed to get response.");
  }
});
