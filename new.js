const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const kaynakDizin = "resimler"; // Resimlerin bulunduğu klasör
const hedefDizin = "new_images"; // Dönüştürülmüş resimlerin kaydedileceği klasör
const basarisizDizin = "basarisiz"; // Başarısız resimlerin kaydedileceği klasör

if (!fs.existsSync(hedefDizin)) {
  fs.mkdirSync(hedefDizin);
}

if (!fs.existsSync(basarisizDizin)) {
  fs.mkdirSync(basarisizDizin);
}

const resimDosyaları = fs.readdirSync(kaynakDizin);

async function dönüştürVeKaydet() {
  for (const resimDosyaAdı of resimDosyaları) {
    const kaynakYol = path.join(kaynakDizin, resimDosyaAdı);
    const hedefYol = path.join(hedefDizin, resimDosyaAdı);
    const basarisizYol = path.join(basarisizDizin, resimDosyaAdı);

    try {
      // Resmi yeniden kaydedin (JPG formatında)
      await sharp(kaynakYol).toFile(hedefYol);
      console.log(`Resim dönüştürüldü ve kaydedildi: ${hedefYol}`);
   

    } catch (error) {
      console.error(`Hata oluştu: ${hedefYol}`, error);
      // Başarısız olan dosyayı "basarisiz" klasörüne taşı
      fs.renameSync(kaynakYol, basarisizYol);
    }
  }
}

dönüştürVeKaydet();
