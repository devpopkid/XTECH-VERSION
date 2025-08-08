const { cmd } = require("../command");

const newsletterContext = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363420342566562@newsletter", // ✅ Popkid newsletter
      newsletterName: "🧠 𝙋𝙊𝙋𝙆𝙄𝘿 𝙏𝙀𝘾𝙃", // 📰 Newsletter title
      serverMessageId: 1
    }
  }
};

cmd({
  pattern: "getpp",
  alias: [],
  desc: "Get profile picture of replied user",
  category: "General",
  use: "",
  filename: __filename
}, async (zk, m, msg, { reply }) => {

  if (!m.quoted) {
    return reply("❌ *Reply to a user's message to fetch their profile picture.*");
  }

  const userJid = m.quoted.sender;
  let profilePic;

  try {
    profilePic = await zk.profilePictureUrl(userJid, 'image');
  } catch {
    profilePic = "https://i.ibb.co/sR0p7p6/default.jpg"; // 🖼️ Fallback image
    await reply("⚠️ *Couldn't fetch profile picture, sending default image instead.*");
  }

  await zk.sendMessage(m.chat, {
    image: { url: profilePic },
    caption: `
┌───〔 👤 ᴘʀᴏꜰɪʟᴇ ᴘɪᴄᴛᴜʀᴇ 〕───◉
│ 
│ 👋 *Hello:* @${userJid.split('@')[0]}
│ 🧠 *Powered by:* 𝙋𝙊𝙋𝙆𝙄𝘿-𝙏𝙀𝘾𝙃 🚀
│ 
└──────────────────────────────◉`,
    mentions: [userJid],
    ...newsletterContext
  }, { quoted: m });

});
