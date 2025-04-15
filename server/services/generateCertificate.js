// utils/generateCertificate.js
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateCertificate = async (name, score, topic) => {
  const width = 1200;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Optional: register custom font
  registerFont(path.join(__dirname, "fonts", "Poppins-Bold.ttf"), {
    family: "Poppins",
  });

  // Background
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#222";
  ctx.font = "50px Poppins";
  ctx.fillText("Certificate of Participation", 300, 150);

  ctx.font = "30px Poppins";
  ctx.fillText(`Presented to: ${name}`, 100, 300);
  ctx.fillText(`For participating in the "${topic}" quiz`, 100, 400);
  ctx.fillText(`Score: ${score}`, 100, 500);

  const date = new Date().toLocaleDateString();
  ctx.font = "20px Poppins";
  ctx.fillText(`Date: ${date}`, 100, 600);

  const buffer = canvas.toBuffer("image/png");

  // Save temporarily
  const filename = `certificate-${Date.now()}.png`;
  const filepath = path.join(__dirname, "..", "temp", filename);
  fs.writeFileSync(filepath, buffer);

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(filepath, {
    folder: "certificates",
  });

  // Delete local file
  fs.unlinkSync(filepath);

  return result.secure_url;
};

module.exports = generateCertificate;