import "dotenv/config";
import cloudinary from "./src/config/cloudinary.config";
import * as fs from "fs";
import * as path from "path";

const IMAGES_DIR = "C:\\Users\\jaish\\.gemini\\antigravity\\brain\\370edab1-5271-4e2a-8bb6-ac12af68f3bd";

const imagesToUpload = [
  // Base transparent images (for design editor)
  { file: "mug_transparent_1778999731636.png", folder: "Brandforge-ai/products/mug", name: "mug-base" },
  { file: "phonecase_transparent_1778999745342.png", folder: "Brandforge-ai/products/phonecase", name: "phonecase-base" },
  { file: "cap_transparent_1778999761609.png", folder: "Brandforge-ai/products/cap", name: "cap-base" },
  
  // Mug color mockups
  { file: "mug_transparent_1778999731636.png", folder: "Brandforge-ai/mockups/mug", name: "mug-white-mockup" },
  { file: "mug_black_1778999782755.png", folder: "Brandforge-ai/mockups/mug", name: "mug-black-mockup" },
  { file: "mug_navy_1778999797115.png", folder: "Brandforge-ai/mockups/mug", name: "mug-navy-mockup" },
  
  // Phone case color mockups
  { file: "phonecase_transparent_1778999745342.png", folder: "Brandforge-ai/mockups/phonecase", name: "phonecase-white-mockup" },
  { file: "phonecase_black_1778999811948.png", folder: "Brandforge-ai/mockups/phonecase", name: "phonecase-black-mockup" },
  { file: "phonecase_clear_1778999825482.png", folder: "Brandforge-ai/mockups/phonecase", name: "phonecase-clear-mockup" },
  
  // Cap color mockups
  { file: "cap_transparent_1778999761609.png", folder: "Brandforge-ai/mockups/cap", name: "cap-white-mockup" },
  { file: "cap_black_1778999840250.png", folder: "Brandforge-ai/mockups/cap", name: "cap-black-mockup" },
  { file: "cap_red_1778999856927.png", folder: "Brandforge-ai/mockups/cap", name: "cap-red-mockup" },
  { file: "cap_navy_1778999876572.png", folder: "Brandforge-ai/mockups/cap", name: "cap-navy-mockup" },
];

async function uploadAll() {
  const results: Record<string, string> = {};
  
  for (const img of imagesToUpload) {
    const filePath = path.join(IMAGES_DIR, img.file);
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP: ${img.file} not found`);
      continue;
    }
    
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: img.folder,
        public_id: img.name,
        resource_type: "image",
        overwrite: true,
      });
      results[img.name] = result.secure_url;
      console.log(`✅ ${img.name}: ${result.secure_url}`);
    } catch (error: any) {
      console.error(`❌ ${img.name}: ${error.message}`);
    }
  }
  
  console.log("\n\n=== ALL UPLOADED URLs ===");
  console.log(JSON.stringify(results, null, 2));
}

uploadAll();
