const { cmd } = require('../command');
const axios = require('axios');

const newsletterInfo = {
    newsletterJid: '120363420342566562@newsletter',
    newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
    serverMessageId: 143
};

// AI (Lance API)
cmd({
    pattern: "ai",
    alias: ["bot", "dj", "gpt", "gpt4", "bing"],
    desc: "Chat with an AI model",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply, react }) => {
    try {
        if (!q) return reply("🤖 *Please provide a message for the AI.*\n\n📌 Example: `.ai Hello Popkid!`");

        const { data } = await axios.get(`https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`);
        if (!data?.message) {
            await react("❌");
            return reply("🚫 AI failed to respond. Please try again later.");
        }

        await conn.sendMessage(from, {
            text: `🤖 *AI Response:*\n\n${data.message}`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: newsletterInfo
            }
        }, { quoted: mek });

        await react("✅");
    } catch (e) {
        console.error("AI Error:", e);
        await react("❌");
        reply("❌ An error occurred while communicating with AI.");
    }
});

// OpenAI
cmd({
    pattern: "openai",
    alias: ["chatgpt", "gpt3", "open-gpt"],
    desc: "Chat with OpenAI",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply, react }) => {
    try {
        if (!q) return reply("🧠 *Please provide a message for OpenAI.*\n\n📌 Example: `.openai What's the future of AI?`");

        const { data } = await axios.get(`https://vapis.my.id/api/openai?q=${encodeURIComponent(q)}`);
        if (!data?.result) {
            await react("❌");
            return reply("🚫 OpenAI failed to respond. Try again later.");
        }

        await conn.sendMessage(from, {
            text: `🧠 *OpenAI Says:*\n\n${data.result}`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: newsletterInfo
            }
        }, { quoted: mek });

        await react("✅");
    } catch (e) {
        console.error("OpenAI Error:", e);
        await react("❌");
        reply("❌ Error occurred while contacting OpenAI.");
    }
});

// DeepSeek AI
cmd({
    pattern: "deepseek",
    alias: ["deep", "seekai"],
    desc: "Chat with DeepSeek AI",
    category: "ai",
    react: "🔮",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply, react }) => {
    try {
        if (!q) return reply("🔮 *Please provide input for DeepSeek AI.*\n\n📌 Example: `.deepseek Tell me a story`");

        const { data } = await axios.get(`https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(q)}`);
        if (!data?.answer) {
            await react("❌");
            return reply("🚫 DeepSeek AI failed to respond.");
        }

        await conn.sendMessage(from, {
            text: `🔮 *DeepSeek Says:*\n\n${data.answer}`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: newsletterInfo
            }
        }, { quoted: mek });

        await react("✅");
    } catch (e) {
        console.error("DeepSeek Error:", e);
        await react("❌");
        reply("❌ Something went wrong with DeepSeek AI.");
    }
});
