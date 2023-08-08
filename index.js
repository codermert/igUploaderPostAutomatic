const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
require('dotenv').config();

const IG_USERNAME = 'XXXXXX';
const IG_PASSWORD = 'XXXXXX';

const captions = [
  'Gelecek olasılıklardan ibaret, kader ise hangi olasılığı seçeceğinin önceden bilinmesidir.',
  'Klavyedeki boşluk tuşundan hiçbir farkın yok. Yer kaplıyorsun ama boşluktan başka bir şey değilsin.',
  'Her kaybediş kazanmaya giden yolda atılan bir ilmektir.',
  'Hayatı yaşamaya karar verdiğinde her engel tek tek ortadan kalkar.',
  'Durup beklemek kazandırmaz. Harekete geçmek yol aldırır.',
  'Söz geçiremediğim tek şey zaman.',
  'Şeytanın bile ayakta alkışladığı nice masum bakış tanıdık.',
];

const getRandomCaption = () => {
  const randomIndex = Math.floor(Math.random() * captions.length);
  return captions[randomIndex];
};

const postToInsta = async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;

  try {
    const auth = await ig.account.login(IG_USERNAME, IG_PASSWORD);
    console.log(JSON.stringify(auth));

    for (let i = 0; i < 30; i++) {
      const response = await get({
        url: 'https://picsum.photos/800/800', // random picture with 800x800 size
        encoding: null, // this is required, only this way a Buffer is returned
      });

      const imageBuffer = Buffer.from(response);
      const randomCaption = getRandomCaption();

      const publishResult = await ig.publish.photo({
        file: imageBuffer, // image buffer
        caption: randomCaption, // random caption
      });

      console.log('POSTED SUCCESSFULLY:', publishResult);
    }
  } catch (error) {
    console.error('Error while posting to Instagram:', error);
  }
};

postToInsta();
