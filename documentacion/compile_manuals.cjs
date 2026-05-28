const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');

(async () => {
  const configs = {
    launch_options: {
      executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage"
      ]
    }
  };

  try {
    console.log("Iniciando compilación programática de manuales...");
    
    console.log("Compilando: Manual Técnico...");
    const pdfTecnico = await mdToPdf({ path: path.join(__dirname, 'Manual_Tecnico.md') }, configs);
    fs.writeFileSync(path.join(__dirname, 'Manual_Tecnico.pdf'), pdfTecnico.content);
    console.log("✅ ¡Manual Técnico generado exitosamente!");

    console.log("Compilando: Manual de Usuario...");
    const pdfUsuario = await mdToPdf({ path: path.join(__dirname, 'Manual_Usuario.md') }, configs);
    fs.writeFileSync(path.join(__dirname, 'Manual_Usuario.pdf'), pdfUsuario.content);
    console.log("✅ ¡Manual de Usuario generado exitosamente!");
    
    console.log("¡Compilación finalizada con éxito para todos los documentos!");
  } catch (error) {
    console.error("❌ Error durante la compilación:", error);
    process.exit(1);
  }
})();
