const { cmd } = require("../command");
const config = require("../config");

// Compatibility Test
cmd({
  pattern: "compatibility",
  alias: ["friend", "fcheck"],
  desc: "Calculate the compatibility score between two users.",
  category: "fun",
  react: "💖",
  filename: __filename,
  use: "@user1 @user2",
}, async (conn, mek, m, { args, reply }) => {
  if (args.length < 2) return reply("Please mention two users.\nExample: .compatibility @user1 @user2");

  let user1 = m.mentionedJid[0];
  let user2 = m.mentionedJid[1];
  const special = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;
  let score = Math.floor(Math.random() * 1000) + 1;
  if ([user1, user2].includes(special)) score = 1000;

  await conn.sendMessage(mek.chat, {
    text: `💖 Compatibility Test 💖\n\n@${user1.split("@")[0]} ❤️ @${user2.split("@")[0]} = *${score}/1000*`,
    mentions: [user1, user2],
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true
    }
  }, { quoted: mek });
});

// Aura Score
cmd({
  pattern: "aura",
  desc: "Calculate aura score of a user.",
  category: "fun",
  react: "👁️",
  filename: __filename,
  use: "@user",
}, async (conn, mek, m, { args, reply }) => {
  if (args.length < 1) return reply("Tag someone to check their aura.\nExample: .aura @user");
  let user = m.mentionedJid[0];
  const special = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;
  let aura = Math.floor(Math.random() * 1000) + 1;
  if (user === special) aura = 999999;

  await conn.sendMessage(mek.chat, {
    text: `👁️ Aura for @${user.split("@")[0]}: *${aura}/1000*`,
    mentions: [user],
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true
    }
  }, { quoted: mek });
});

// Roast (English)
cmd({
  pattern: "roast",
  desc: "Send a funny roast to someone.",
  category: "fun",
  react: "🔥",
  filename: __filename,
  use: "@user"
}, async (conn, mek, m, { reply }) => {
  let roasts = [
    "You're like a cloud. When you disappear, it's a beautiful day.",
    "You bring everyone so much joy... when you leave the room.",
    "If I had a dollar for every smart thing you said, I’d be broke.",
    "You're like a software update, always promising but never delivering.",
    "Your secrets are always safe with me. I never even listen when you tell me them.",
    "You're not stupid; you just have bad luck thinking.",
    "You have something on your chin... no, the third one down.",
    "You're like a browser with 100 tabs open, and none are responding.",
    "You're like a math problem with no solution. Confusing and annoying.",
    "You're proof that even evolution takes a break sometimes."
  ];
  let mentioned = m.mentionedJid[0];
  if (!mentioned) return reply("Please tag someone to roast.\nExample: .roast @user");

  let roast = roasts[Math.floor(Math.random() * roasts.length)];

  await conn.sendMessage(mek.chat, {
    text: `🔥 *Roast for @${mentioned.split("@")[0]}*:\n\n_${roast}_\n\n> Just for laughs, don’t take it seriously!`,
    mentions: [mentioned],
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true
    }
  }, { quoted: mek });
});

// 8-Ball
cmd({
  pattern: "8ball",
  desc: "Ask the magic 8-ball a yes/no question.",
  category: "fun",
  react: "🎱",
  filename: __filename,
}, async (conn, mek, m, { q, reply }) => {
  if (!q) return reply("Ask a yes/no question.\nExample: .8ball Will I be rich?");

  let answers = [
    "Yes!", "No.", "Maybe.", "Definitely!", "Not sure.",
    "Ask again later.", "I don’t think so.", "Absolutely!",
    "No way!", "Highly likely!"
  ];
  let response = answers[Math.floor(Math.random() * answers.length)];

  await conn.sendMessage(mek.chat, {
    text: `🎱 *Magic 8-Ball says:* _${response}_`,
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true
    }
  }, { quoted: mek });
});

// Compliment
cmd({
  pattern: "compliment",
  desc: "Send a positive compliment.",
  category: "fun",
  react: "😊",
  filename: __filename,
  use: "@user (optional)"
}, async (conn, mek, m, { reply }) => {
  let compliments = [
    "You're amazing just the way you are! 💖",
    "You light up the room. 🌟",
    "You're a genius in your own way! 🧠",
    "You make life better for everyone! 🥰",
    "Your energy is contagious! 🔥",
    "You're inspiring and strong! 💪",
    "You have a heart of gold! 💛",
    "You're the reason someone smiles today!",
    "You bring magic wherever you go. ✨",
    "You’re a walking bundle of positivity!"
  ];

  let mentioned = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
  let compliment = compliments[Math.floor(Math.random() * compliments.length)];

  let text = mentioned
    ? `😊 Compliment for @${mentioned.split("@")[0]}:\n\n_${compliment}_`
    : `😊 Here's a compliment for you:\n\n_${compliment}_`;

  await conn.sendMessage(mek.chat, {
    text,
    mentions: mentioned ? [mentioned] : [],
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true
    }
  }, { quoted: mek });
});

// Love Test
cmd({
  pattern: "lovetest",
  desc: "Check love compatibility between two users.",
  category: "fun",
  react: "❤️",
  filename: __filename,
  use: "@user1 @user2"
}, async (conn, mek, m, { args, reply }) => {
  if (args.length < 2) return reply("Please tag two users.\nExample: .lovetest @user1 @user2");

  let user1 = args[0].replace("@", "") + "@s.whatsapp.net";
  let user2 = args[1].replace("@", "") + "@s.whatsapp.net";
  let percent = Math.floor(Math.random() * 100) + 1;

  let result = [
    { range: [90, 100], msg: "💖 Perfect match! True love!" },
    { range: [75, 89], msg: "😍 Strong connection and bonding!" },
    { range: [50, 74], msg: "😊 Good potential. Could work out!" },
    { range: [30, 49], msg: "🤔 Needs more effort. Maybe..." },
    { range: [10, 29], msg: "😅 Not ideal, but anything is possible!" },
    { range: [1, 9], msg: "💔 Uh-oh. This might not work." }
  ].find(r => percent >= r.range[0] && percent <= r.range[1]).msg;

  await conn.sendMessage(mek.chat, {
    text: `💘 *Love Test* 💘\n\n❤️ @${user1.split("@")[0]} + @${user2.split("@")[0]} = *${percent}%*\n${result}`,
    mentions: [user1, user2],
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true
    }
  }, { quoted: mek });
});

// Emoji Text
cmd({
  pattern: "emoji",
  desc: "Convert text to emoji style.",
  category: "fun",
  react: "🔤",
  filename: __filename,
  use: "<text>"
}, async (conn, mek, m, { args, reply }) => {
  let text = args.join(" ").toLowerCase();
  if (!text) return reply("Provide text to convert.\nExample: .emoji hello");

  let map = {
    a: "🅰️", b: "🅱️", c: "🇨", d: "🇩", e: "🇪", f: "🇫",
    g: "🇬", h: "🇭", i: "🇮", j: "🇯", k: "🇰", l: "🇱",
    m: "🇲", n: "🇳", o: "🅾️", p: "🇵", q: "🇶", r: "🇷",
    s: "🇸", t: "🇹", u: "🇺", v: "🇻", w: "🇼", x: "🇽",
    y: "🇾", z: "🇿", " ": "␣", "0": "0️⃣", "1": "1️⃣", "2": "2️⃣",
    "3": "3️⃣", "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣",
    "8": "8️⃣", "9": "9️⃣"
  };

  let converted = text.split("").map(char => map[char] || char).join("");

  await conn.sendMessage(mek.chat, {
    text: converted,
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true
    }
  }, { quoted: mek });
});
