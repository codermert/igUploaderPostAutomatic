const axios = require('axios');
const { IgApiClient } = require('instagram-private-api');
require('dotenv').config();

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

const getRandomMusicName = async () => {
  try {
    const response = await axios.get(
      'https://gist.githubusercontent.com/manios/4515112/raw/f75c8572becbfb23ac4418f530cc1e7afd4b2b0d/musiclist.md'
    );
    const musicNames = response.data.split('\n');
    const randomIndex = Math.floor(Math.random() * musicNames.length);
    return `🎧 ${musicNames[randomIndex].trim()}`;
  } catch (error) {
    console.error('Error while fetching music names:', error);
    return null;
  }
};

const updateProfilePhoto = async () => {
  try {
    const imageUrl = 'https://source.unsplash.com/1080x1080/?model';
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');

    const ig = new IgApiClient();
    ig.state.generateDevice(IG_USERNAME);
    ig.state.proxyUrl = process.env.IG_PROXY;

    const auth = await ig.account.login(IG_USERNAME, IG_PASSWORD);
    console.log('Logged in:', auth);

    // Update profile photo
    const changedProfilePicture = await ig.account.changeProfilePicture(imageBuffer);
    console.log('Profile photo updated:', changedProfilePicture);
  } catch (error) {
    console.error('Error while updating profile photo:', error);
  }
};

const postToInsta = async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;

  try {
    const auth = await ig.account.login(IG_USERNAME, IG_PASSWORD);
    console.log(JSON.stringify(auth));

    // Biyografi güncelleme
    const randomBiography = await getRandomMusicName();
    await ig.account.setBiography(randomBiography);
    console.log('Biography updated:', randomBiography);

    const albumUrls = [
      'https://source.unsplash.com/1080x1080/?model',
      'https://source.unsplash.com/1080x1080/?model',
      'https://source.unsplash.com/1080x1080/?model',
    ];

    for (let i = 0; i < 10; i++) {
      const randomAlbumUrls = [];
      for (let j = 0; j < 3; j++) {
        randomAlbumUrls.push(albumUrls[Math.floor(Math.random() * albumUrls.length)]);
      }

      const imageBuffers = await Promise.all(
        randomAlbumUrls.map(async (url) => {
          const response = await axios.get(url, { responseType: 'arraybuffer' });
          return Buffer.from(response.data, 'binary');
        })
      );

      const randomCaption = await getRandomCaption();

      // Albüm paylaşımı
      const publishResult = await ig.publish.album({
        items: imageBuffers.map((buffer) => ({
          file: buffer,
          type: 'photo',
        })),
        caption: randomCaption,
      });

      console.log('Albüm paylaşıldı:', publishResult);

      // Hikaye paylaşımı
      const storyResponse = await axios.get(
        'https://source.unsplash.com/1080x1920/?model',
        { responseType: 'arraybuffer' }
      );
      const storyImageBuffer = Buffer.from(storyResponse.data, 'binary');

      const storyPublishResult = await ig.publish.story({
        file: storyImageBuffer,
      });
      console.log('Hikaye paylaşıldı:', storyPublishResult);
    }
  } catch (error) {
    console.error('Error while posting to Instagram:', error);
  }
};

updateProfilePhoto();
postToInsta();
