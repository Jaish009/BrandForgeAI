import "dotenv/config";
import cloudinary from "./src/config/cloudinary.config";
import { Env } from "./src/config/env.config";

// Images that need background removal
const images = [
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999905/Brandforge-ai/products/mug/mug-base.jpg",
    folder: "Brandforge-ai/products/mug",
    name: "mug-transparent-base",
    label: "Mug Base"
  },
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999906/Brandforge-ai/products/phonecase/phonecase-base.jpg",
    folder: "Brandforge-ai/products/phonecase",
    name: "phonecase-transparent-base",
    label: "Phone Case Base"
  },
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999907/Brandforge-ai/products/cap/cap-base.jpg",
    folder: "Brandforge-ai/products/cap",
    name: "cap-transparent-base",
    label: "Cap Base"
  },
  // Mug mockups
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999908/Brandforge-ai/mockups/mug/mug-white-mockup.jpg",
    folder: "Brandforge-ai/mockups/mug",
    name: "mug-white-mockup-transparent",
    label: "Mug White Mockup"
  },
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999909/Brandforge-ai/mockups/mug/mug-black-mockup.jpg",
    folder: "Brandforge-ai/mockups/mug",
    name: "mug-black-mockup-transparent",
    label: "Mug Black Mockup"
  },
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999910/Brandforge-ai/mockups/mug/mug-navy-mockup.jpg",
    folder: "Brandforge-ai/mockups/mug",
    name: "mug-navy-mockup-transparent",
    label: "Mug Navy Mockup"
  },
  // Phone case mockups
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999911/Brandforge-ai/mockups/phonecase/phonecase-white-mockup.jpg",
    folder: "Brandforge-ai/mockups/phonecase",
    name: "phonecase-white-mockup-transparent",
    label: "Phone Case White Mockup"
  },
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999912/Brandforge-ai/mockups/phonecase/phonecase-black-mockup.jpg",
    folder: "Brandforge-ai/mockups/phonecase",
    name: "phonecase-black-mockup-transparent",
    label: "Phone Case Black Mockup"
  },
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999913/Brandforge-ai/mockups/phonecase/phonecase-clear-mockup.jpg",
    folder: "Brandforge-ai/mockups/phonecase",
    name: "phonecase-clear-mockup-transparent",
    label: "Phone Case Clear Mockup"
  },
  // Cap mockups
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999915/Brandforge-ai/mockups/cap/cap-white-mockup.jpg",
    folder: "Brandforge-ai/mockups/cap",
    name: "cap-white-mockup-transparent",
    label: "Cap White Mockup"
  },
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999916/Brandforge-ai/mockups/cap/cap-black-mockup.jpg",
    folder: "Brandforge-ai/mockups/cap",
    name: "cap-black-mockup-transparent",
    label: "Cap Black Mockup"
  },
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999917/Brandforge-ai/mockups/cap/cap-red-mockup.jpg",
    folder: "Brandforge-ai/mockups/cap",
    name: "cap-red-mockup-transparent",
    label: "Cap Red Mockup"
  },
  {
    sourceUrl: "https://res.cloudinary.com/dqon2srpn/image/upload/v1778999918/Brandforge-ai/mockups/cap/cap-navy-mockup.jpg",
    folder: "Brandforge-ai/mockups/cap",
    name: "cap-navy-mockup-transparent",
    label: "Cap Navy Mockup"
  },
];

async function removeBackgroundAndUpload() {
  const results: Record<string, string> = {};

  for (const img of images) {
    try {
      console.log(`\n🔄 Processing: ${img.label}...`);
      
      // Step 1: Remove background using remove.bg
      const formData = new FormData();
      formData.append("image_url", img.sourceUrl);
      formData.append("size", "auto");

      const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": Env.REMOVE_BG_API_KEY! },
        body: formData,
      });

      if (!bgRes.ok) {
        const errorText = await bgRes.text();
        console.error(`❌ ${img.label}: remove.bg failed - ${bgRes.status} ${errorText}`);
        continue;
      }

      const bgBuffer = Buffer.from(await bgRes.arrayBuffer());
      console.log(`   ✅ Background removed (${Math.round(bgBuffer.length / 1024)}KB)`);

      // Step 2: Upload transparent PNG to Cloudinary
      const uploaded = await cloudinary.uploader.upload(
        `data:image/png;base64,${bgBuffer.toString("base64")}`,
        {
          folder: img.folder,
          public_id: img.name,
          resource_type: "image",
          overwrite: true,
        }
      );

      results[img.label] = uploaded.secure_url;
      console.log(`   ✅ Uploaded: ${uploaded.secure_url}`);
    } catch (error: any) {
      console.error(`❌ ${img.label}: ${error.message}`);
    }
  }

  console.log("\n\n=== ALL TRANSPARENT URLs ===");
  console.log(JSON.stringify(results, null, 2));
}

removeBackgroundAndUpload();
