const fs = require("fs");
const dir = __dirname;
const { createCanvas, loadImage } = require("canvas");

const width = 240;
const height = 240;

const console = require("console");
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

function randInt(max) {
  return Math.floor(Math.random() * max);
}

const getElements = (partition, i) => {
  const path = `${dir}/input/${partition}`;

  let pngs = fs.readdirSync(path);
  pngs = pngs.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item)); // Remove .DS_Store
  const selected = pngs[i % pngs.length];

  return {
    id: i % pngs.length,
    name: selected.slice(0, -4),
    path: `${path}/${selected}`,
  };
};

const generateMetadata = (edition, attributes, description) => {
  const baseImageUri = "https://ipfs.io/ipfs";

  let tempMetadata = {
    name: `#${edition}`,
    description: description,
    image: `${baseImageUri}/${edition}`,
    external_url: `${baseImageUri}/${edition}`,
    edition: edition,
    date: Date.now(),
    attributes: attributes,
  };
  return tempMetadata;
};

const generateFourSquares = async () => {
  let attributesList = [];

  let hue = Math.floor(Math.random() * 360);
  ctx.fillStyle = `hsl(${hue}, 100%, 85%)`;
  ctx.fillRect(0, 0, width, height);

  for (let i = 1; i <= 4; i++) {
    const partition = `partition${i}`;
    const el = getElements(partition, randInt(100));
    ctx.drawImage(await loadImage(el.path), 0, 0, width, height);
    attributesList.push({ [partition]: el.name });
  }

  return attributesList;
};

async function processArray() {
  const totalItems = 10;

  for (let i = 0; i < totalItems; i++) {
    const attributes = await generateFourSquares();
    const metaData = generateMetadata(i, attributes);

    fs.writeFileSync(`./output/${i}.png`, canvas.toBuffer("image/png"));
    fs.writeFileSync(`./output/metadata${i}.json`, JSON.stringify(metaData));
  }
}

processArray();
