import prisma from './src/config/database.js';

async function fixImageUrls() {
  try {
    const images = await prisma.carImage.findMany();
    console.log(`Found ${images.length} images to check`);

    let fixed = 0;
    for (const image of images) {
      if (image.imageUrl.includes('/car-images/')) {
        const newUrl = image.imageUrl.replace('/car-images/', '/car-showroom/');
        await prisma.carImage.update({
          where: { id: image.id },
          data: { imageUrl: newUrl }
        });
        console.log(`Fixed: ${image.imageUrl} -> ${newUrl}`);
        fixed++;
      }
    }

    console.log(`Done! Fixed ${fixed} image URLs.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixImageUrls();
