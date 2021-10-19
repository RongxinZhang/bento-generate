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

  return { id: i, name: selected.slice(0, -4), path: `${path}/${selected}` };
};

const generate = async (itemNum) => {
  let hue = Math.floor(Math.random() * 360);
  ctx.fillStyle = `hsl(${hue}, 100%, 85%)`;
  ctx.fillRect(0, 0, width, height);

  console.log(randInt(100), hue);
  let image = await loadImage(getElements("partition1", randInt(100)).path);
  ctx.drawImage(image, 0, 0, width, height);

  image = await loadImage(getElements("partition2", randInt(100)).path);
  ctx.drawImage(image, 0, 0, width, height);

  image = await loadImage(getElements("partition3", randInt(100)).path);
  ctx.drawImage(image, 0, 0, width, height);

  image = await loadImage(getElements("partition4", randInt(100)).path);
  ctx.drawImage(image, 0, 0, width, height);

  fs.writeFileSync(`./output/${itemNum}.png`, canvas.toBuffer("image/png"));
};

async function processArray() {
  for (let i = 0; i < 20; i++) {
    await generate(i);
  }
}

processArray();
