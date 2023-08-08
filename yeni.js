const axios = require('axios');
const { IgApiClient, StickerBuilder } = require('instagram-private-api');
const { get } = require('request-promise');
require('dotenv').config();
const fs = require('fs').promises;

const IG_USERNAME = 'XXXXXXX';
const IG_PASSWORD = 'XXXXXXX';

const getRandomCaption = async () => {
  try {
    const response = await axios.get(
      'https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json'
    );
    const quotes = response.data;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    return `${randomQuote.quoteText}\n- ${randomQuote.quoteAuthor}`;
  } catch (error) {
    console.error('Error while fetching captions:', error);
    return null;
  }
};

const postToInsta = async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;

  try {
    const auth = await ig.account.login(IG_USERNAME, IG_PASSWORD);
    console.log(JSON.stringify(auth));

    for (let i = 0; i < 10; i++) {
      const response = await get({
        url: 'https://picsum.photos/1080/1080', // random picture with 800x800 size
        encoding: null, // this is required, only this way a Buffer is returned
      });

      const imageBuffer = Buffer.from(response);
      const randomCaption = await getRandomCaption();

      // Gönderi paylaşımı
      const publishResult = await ig.publish.photo({
        file: imageBuffer, // image buffer
        caption: randomCaption, // random caption
      });

      console.log('POSTED SUCCESSFULLY:', publishResult);

      // Hikaye paylaşımı
      const storyResponse = await get({
        url: 'https://picsum.photos/1080/1920', // random picture with 1080x1080 size
        encoding: null,
      });

      const storyImageBuffer = Buffer.from(storyResponse);
      const options = {
        file: storyImageBuffer,
      };

      const storyPublishResult = await ig.publish.story(options);
      console.log('STORY POSTED SUCCESSFULLY:', storyPublishResult);
    }
  } catch (error) {
    console.error('Error while posting to Instagram:', error);
  }
};

postToInsta();
