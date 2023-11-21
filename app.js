const fs = require("fs");
const path = require("path");
const { removeBackgroundFromImageFile } = require("remove.bg");

const kaynakDizin = "new_images";
const hedefDizin = "transparan";
const basarisizDizin = "basarisiz";
const apiKeys = [

  "3eVQsyPuMb3z3CoPLiVhkoXa",
  "zgLDhwVJXZTE39dM7ZCZKpvU",
  "dRBd36d86t8e7Fz9Zdo885kr",
  "wqV3QgPbLZFHaw8P1WTvCrDf",
   "ugQHScsUdfyxUP5cxQJ9LPES"
]; 
let currentApiKeyIndex = 0;

if (!fs.existsSync(hedefDizin)) {
  fs.mkdirSync(hedefDizin);
}

if (!fs.existsSync(basarisizDizin)) {
  fs.mkdirSync(basarisizDizin);
}

const resimDosyaları = fs.readdirSync(kaynakDizin);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function processImages() {
  for (const resimDosyaAdı of resimDosyaları) {
    await delay(800);

    const kaynakYol = path.join(kaynakDizin, resimDosyaAdı);
    const hedefYol = path.join(hedefDizin, resimDosyaAdı);
    const basarisizYol = path.join(basarisizDizin, resimDosyaAdı);

    try {
      await removeBackgroundWithNextApiKey(kaynakYol, hedefYol);

      console.log(`Arka planı kaldırılmış ve kaydedilmiş: ${hedefYol}`);
      fs.unlinkSync(kaynakYol);
    } catch (errors) {
      console.log(errors);
      if (errors[0].code === "insufficient_credits") {
        console.error(`Hakkın bitti. Sonraki API anahtarını deneyeceğim.`);
        switchToNextApiKey();
      } else if (errors[0].code === "rate_limit_exceeded") {
        console.log("1 dakika içerisinde maximum 50mb dosya yükleyebilirsiniz. Biraz sonra tekrar deneyiniz");
        process.exit(1);
      } else {
        console.error(`Hata oluştu: ${basarisizYol}`);
        fs.renameSync(kaynakYol, basarisizYol);
      }
    }
  }
}

async function removeBackgroundWithNextApiKey(kaynakYol, hedefYol) {
  try {
    await removeBackgroundFromImageFile({
      path: kaynakYol,
      apiKey: apiKeys[currentApiKeyIndex],
      size: "regular",
      type: "auto",
      outputFile: hedefYol,
    });
  } catch (error) {
    throw error;
  }
}

function switchToNextApiKey() {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length; // Bir sonraki API anahtarına geç
}

processImages();
