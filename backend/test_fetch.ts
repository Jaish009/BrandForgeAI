import dotenv from 'dotenv';
dotenv.config();
import cloudinary from './src/config/cloudinary.config';

async function main() {
  const mockupUrl = "https://res.cloudinary.com/dp9vvlndo/image/upload/v1773687937/tshirt-dark-grey-mockup_bdbvfa.png";
  const artworkPublicId = "Brandforge-ai:artworks:bvafbzm4quusx5s97wzv";
  
  const url = cloudinary.url(mockupUrl, {
    type: "fetch",
    transformation: [
      { overlay: artworkPublicId },
      { width: 336, height: 447, crop: "fit" },
      {
        flags: "layer_apply",
        gravity: "north_west",
        x: 294,
        y: 241
      }
    ],
    format: "jpg"
  });
  
  console.log("Fetched URL:", url);
}

main();
