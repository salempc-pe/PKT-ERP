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
          <Scan className="h-4 w-4 text-[var(--color-on-surface-variant)]" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          onKeyDown={handleManualSubmit}
          className="block w-full pl-10 pr-3 py-2.5 border border-[var(--color-outline-variant)] rounded-xl leading-5 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[#6B4FD8]/20 focus:border-[#6B4FD8] sm:text-sm transition-all"
          placeholder={placeholder}
        />
      </div>

      {/* Botón para Cámara */}
      <button
        onClick={() => setIsCameraOpen(true)}
        className="p-2.5 bg-[var(--color-surface-variant)] text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-outline-variant)]/30 transition-colors border border-[var(--color-outline-variant)]"
        title="Usar Cámara"
      >
        <Camera className="h-5 w-5" />
      </button>

      {/* Modal de Cámara */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-[var(--color-surface-container-highest)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--color-outline-variant)]/30 animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center bg-[var(--color-surface-container)]">
              <h3 className="font-bold text-[var(--color-on-surface)] flex items-center gap-2">
                <Camera className="h-5 w-5 text-[var(--color-primary)]" />
                Escaneo por Cámara
              </h3>
              <button 
                onClick={() => setIsCameraOpen(false)}
                className="p-1.5 hover:bg-[var(--color-outline-variant)]/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-[var(--color-on-surface-variant)]" />
              </button>
            </div>
            
            <div className="p-6 bg-[var(--color-surface-container-low)]">
              <div id="reader" className="w-full overflow-hidden rounded-xl border-2 border-dashed border-[var(--color-outline-variant)] bg-black/10"></div>
              <p className="mt-4 text-xs font-bold text-center text-[var(--color-on-surface-variant)] uppercase tracking-wide">
                Coloque el código de barras o QR frente a la cámara
              </p>
            </div>

            <div className="p-4 bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)]/30 flex justify-end">
              <button
                onClick={() => setIsCameraOpen(false)}
                className="px-5 py-2 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] rounded-xl hover:bg-[var(--color-surface-container)] text-sm font-bold transition-colors"
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
