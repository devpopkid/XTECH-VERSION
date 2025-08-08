const { cmd } = require('../command');
const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');

cmd({
    pattern: "topdf",
    alias: ["pdf", "topdf"],
    use: '.topdf Your text here',
    desc: "Convert provided text to a PDF file.",
    react: "📄",
    category: "utilities",
    filename: __filename
},
async (conn, mek, m, {
    from, q, sender, reply
}) => {
    try {
        if (!q) {
            return reply("📥 *Please provide the text to convert into PDF.*\n\n📌 Example: `.topdf Hello Popkid XTECH!`");
        }

        // Create PDF
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);
            await conn.sendMessage(from, {
                document: pdfData,
                mimetype: 'application/pdf',
                fileName: 'PopkidTech.pdf',
                caption: `*📄 PDF created successfully!*\n\n> ✍️ Created by: @${sender.split("@")[0]}\n\n🌟 Powered by *PopkidXtech*`,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420342566562@newsletter',
                        newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });
        });

        // Write text to PDF and finish
        doc.text(q);
        doc.end();

    } catch (e) {
        console.error('Error in .topdf:', e);
        reply(`❌ Error occurred:\n${e.message}`);
    }
});
