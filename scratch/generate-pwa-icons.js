import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Rutas de archivos
const svgPath = path.resolve('public/favicon.svg');
const sizes = [192, 512];

async function generateIcons() {
  console.log('🚀 Iniciando la generación de iconos PNG para la PWA...');
  
  if (!fs.existsSync(svgPath)) {
    console.error(`❌ Error: No se encontró el archivo SVG en la ruta: ${svgPath}`);
    process.exit(1);
  }

  for (const size of sizes) {
    const outputPath = path.resolve(`public/pwa-${size}x${size}.png`);
    console.log(`⏳ Renderizando icono de ${size}x${size}...`);
    
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(outputPath);
      
    console.log(`✅ ¡Creado con éxito! -> ${outputPath}`);
  }
  
  console.log('\n🎉 ¡Todos los iconos de la PWA se han generado correctamente y están listos para usar!');
}

generateIcons().catch((err) => {
  console.error('❌ Error al generar los iconos:', err);
  process.exit(1);
});
