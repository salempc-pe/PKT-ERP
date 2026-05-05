import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { 
  Scan, 
  Keyboard, 
  X, 
  Camera 
} from "lucide-react";

const BarcodeScanner = ({ onScan, placeholder = "Escanear código..." }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const inputRef = useRef(null);
  const scannerRef = useRef(null);

  // Auto-focus para lectores USB físicos
  useEffect(() => {
    if (!isCameraOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCameraOpen]);

  // Manejar escaneo por cámara
  useEffect(() => {
    if (isCameraOpen) {
      const scanner = new Html5QrcodeScanner(
        "reader", 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render((decodedText) => {
        onScan(decodedText);
        setIsCameraOpen(false);
        scanner.clear();
      }, (error) => {
        // Ignorar errores de escaneo continuo (no encontró código en el frame)
      });

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Error clearing scanner:", err));
      }
    };
  }, [isCameraOpen, onScan]);

  const handleManualSubmit = (e) => {
    if (e.key === "Enter" && manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode("");
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Input para Lector USB (Teclado) */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Scan className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          onKeyDown={handleManualSubmit}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>

      {/* Botón para Cámara */}
      <button
        onClick={() => setIsCameraOpen(true)}
        className="p-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
        title="Usar Cámara"
      >
        <Camera className="h-5 w-5" />
      </button>

      {/* Modal de Cámara */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-600" />
                Escaneo por Cámara
              </h3>
              <button 
                onClick={() => setIsCameraOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div id="reader" className="w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300"></div>
              <p className="mt-4 text-xs text-center text-gray-500">
                Coloque el código de barras o QR frente a la cámara
              </p>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setIsCameraOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
