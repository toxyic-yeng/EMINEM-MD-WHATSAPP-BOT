const axios = require('axios');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { client, m, sendReply } = context;

    try {
      // Fetch the latest commit information
      const { data } = await axios.get('https://github.com/toxyic-yeng/EMINEM-MD-WHATSAPP-BOT/commits/main');
      const commitHash = data.sha;
      const author = data.commit.author.name;
      const date = new Date(data.commit.author.date).toLocaleString('en-US', { timeZone: 'UTC' });
      const modifiedFiles = data.files ? data.files.map(file => `📄 ${file.filename}`).join('\n') : 'No files modified';

      // Get the current commit hash from package.json
      let currentCommitHash = 'unknown';
      try {
        const packageData = require('../../package.json'); // Adjusted the relative path
        currentCommitHash = packageData.commitHash || 'unknown';
      } catch (error) {
        console.error('Error reading package.json:', error);
      }

      // Compare hashes and respond
      if (commitHash === currentCommitHash) {
        sendReply(client, m, 'You are using the latest version of Eminem MD');
      } else {
        sendReply(
          client,
          m,
          `*Here are the updates:*\n` +
          ` *Last Commit*: \`${commitHash}\`\n` +
          ` *Author*: ${author}\n` +
          ` *Date*: ${date}\n` +
          ` *Files Modified*:\n${modifiedFiles}\n\n` +
          `To update the bot, please run the command \`.update\`.`
        );
      }
    } catch (error) {
      console.error('Check update error:', error);
      sendReply(client, m, '❌ Check update failed. Please try manually.');
    }
  });
}
