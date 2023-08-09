const request = require('request');
const { IgApiClient } = require('instagram-private-api');
require('dotenv').config();

const IG_USERNAME = 'XXXXXXXXXXX';
const IG_PASSWORD = 'XXXXXXXXXXX';

const getRandomCaption = async () => {
  try {
    const response = await getRequest(
      'https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json'
    );
    const quotes = JSON.parse(response);
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
    const response = await getRequest(
      'https://gist.githubusercontent.com/manios/4515112/raw/f75c8572becbfb23ac4418f530cc1e7afd4b2b0d/musiclist.md'
    );
    const musicNames = response.toString().split('\n');
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
    const imageBuffer = await getRequest(imageUrl);

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
      for (let j = 0; j < 10; j++) {
        randomAlbumUrls.push(albumUrls[Math.floor(Math.random() * albumUrls.length)]);
      }

      const imageBuffers = await Promise.all(
        randomAlbumUrls.map(async (url) => {
          const response = await getRequest(url);
          return Buffer.from(response, 'binary');
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
      const storyResponse = await getRequest('https://source.unsplash.com/1080x1920/?model');
      const storyImageBuffer = Buffer.from(storyResponse, 'binary');

      const storyPublishResult = await ig.publish.story({
        file: storyImageBuffer,
      });
      console.log('Hikaye paylaşıldı:', storyPublishResult);
    }
  } catch (error) {
    console.error('Error while posting to Instagram:', error);
  }
};

// getRequest fonksiyonunu tanımlayın
const getRequest = (url) => {
  return new Promise((resolve, reject) => {
    request.get({ url, encoding: null }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

updateProfilePhoto();
postToInsta();
