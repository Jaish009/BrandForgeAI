import dotenv from 'dotenv';
dotenv.config();
import { getMockupUrlService } from './src/services/listing.service';

async function main() {
  try {
    const slug = "tooth-t-shirt-1778747843017";
    const colorName = "very-dark-gray";
    const url = await getMockupUrlService(slug, colorName);
    console.log("Generated URL:", url);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
