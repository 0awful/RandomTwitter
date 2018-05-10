// delete this in prod

const writer = require('./randomWriter');
const ourWriter = new writer.writer(2);
ourWriter.read(
  "This is the song that never ends because it goes on and on my friends. Some people started singing it because they didn't know, and they kept singing because on and on it goes because this is the song that never ends"
);
const tweet = ourWriter.writeStringShorterThan(1500);
