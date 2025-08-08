const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg"],
    react: "🦋",
    desc: "Search and download Google images",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
}, 
async (conn, mek, m, { reply, args, from, sender }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("📸 *Please provide a search term.*\n\n_Example:_ `.img cute cats`");
        }

        await reply(`🔍 *Searching for:* _${query}_`);

        const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        if (!response.data?.success || !response.data.results?.length) {
            return reply("❌ *No images found. Try using different keywords.*");
        }

        const results = response.data.results;
        const selectedImages = results.sort(() => 0.5 - Math.random()).slice(0, 5);

        const newsletterInfo = {
            newsletterJid: '120363420342566562@newsletter',
            newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
            serverMessageId: 143
        };

        for (const imageUrl of selectedImages) {
            await conn.sendMessage(
                from,
                {
                    image: { url: imageUrl },
                    caption: `📸 *Result for:* _${query}_\n\n> _Powered by_ *PopkidXtech💖*`,
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: newsletterInfo
                    }
                },
                { quoted: mek }
            );
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error("❌ Image Search Error:", error);
        reply("⚠️ *An error occurred while fetching images.*\n\n" + error.message);
    }
});
