const { cmd } = require('../command');

cmd({
    pattern: 'listonline',
    desc: '🟢 List all currently online members in a group chat',
    category: 'group',
    filename: __filename,
    fromMe: true // change to false to make it public
}, async (message) => {
    if (!message.isGroup) {
        return await message.reply('⚠️ This command only works in group chats.');
    }

    const groupMetadata = await message.client.groupMetadata(message.jid);
    const participants = groupMetadata.participants;
    const onlineUsers = [];

    // Fetch presence data
    for (const user of participants) {
        const userId = user.id || user.jid;
        const presence = message.client.presence?.[userId];

        if (presence && ['available', 'composing', 'recording'].includes(presence.lastKnownPresence)) {
            onlineUsers.push(`@${userId.split('@')[0]}`);
        }
    }

    if (onlineUsers.length === 0) {
        return await message.reply('🔕 No members are currently online in this group.');
    }

    await message.reply(
        `🟢 *Online Members in ${groupMetadata.subject}*:\n\n${onlineUsers.map(u => '• ' + u).join('\n')}`,
        { mentions: onlineUsers.map(u => u + '@s.whatsapp.net') }
    );
});
