import { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../context/AuthContext';
import { 
  MessageSquare, 
  Phone, 
  Send, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  UserCheck, 
  Clock, 
  Database,
  Terminal,
  RefreshCw,
  Search,
  BadgeAlert
} from 'lucide-react';

export default function AdminWhatsappSimulator() {
  const { allUsers } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [manualPhone, setManualPhone] = useState('');
  const [otpBinding, setOtpBinding] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Configuración del endpoint local de Cloud Functions
  const [endpointUrl, setEndpointUrl] = useState('http://127.0.0.1:5001/pkt-erp/us-central1/velóAssistantEndpoint');

  // Estado del chat
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: '¡Hola! Soy Veló AI. Envíame un mensaje para comenzar a interactuar, o simula la vinculación OTP enviando el código de 6 dígitos de un usuario.',
      suggestions: ['¿Qué puedo hacer?', 'Ver stock de palas']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Historial de Logs
  const [logs, setLogs] = useState([]);

  const messagesEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSending]);

  // Buscar OTPs activos en la colección `/whatsapp_bindings`
  useEffect(() => {
    if (!selectedUser) {
      setOtpBinding(null);
      return;
    }

    setOtpLoading(true);
    // Crear consulta reactiva a bindings del usuario
    const q = query(
      collection(db, 'whatsapp_bindings'), 
      where('userId', '==', selectedUser.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // Encontrar el token que no haya expirado
        const now = Date.now();
        const activeBinding = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .find(binding => {
            const expires = binding.expiresAt?.toDate ? binding.expiresAt.toDate().getTime() : 0;
            return expires > now;
          });
        setOtpBinding(activeBinding || null);
      } else {
        setOtpBinding(null);
      }
      setOtpLoading(false);
    }, (error) => {
      console.error("Error leyendo whatsapp_bindings:", error);
      setOtpLoading(false);
    });

    return () => unsubscribe();
  }, [selectedUser]);

  // Si se selecciona un usuario, autocompletar su teléfono
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (user.whatsappNumber) {
      setManualPhone(user.whatsappNumber);
    } else {
      setManualPhone('');
    }
  };

  const handleCopyOtp = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  // Simulación de envío del webhook de WhatsApp
  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || !manualPhone) return;

    if (!textToSend) {
      setInputMessage('');
    }

    // Agregar mensaje del usuario a la UI del chat
    const userMsgId = Date.now().toString();
    setChatMessages(prev => [...prev, { id: userMsgId, role: 'user', text }]);
    setIsSending(true);

    // 1. Estructurar payload del webhook al estilo Meta
    const metaWebhookPayload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "1234567890",
          changes: [
            {
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "15555555555",
                  phone_number_id: "1234567890"
                },
                contacts: [
                  {
                    profile: {
                      name: selectedUser?.name || "Usuario Simulado"
                    },
                    wa_id: manualPhone
                  }
                ],
                messages: [
                  {
                    from: manualPhone,
                    id: `wamid.HBgL${Math.random().toString(36).substring(7)}`,
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    text: {
                      body: text
                    },
                    type: "text"
                  }
                ]
              },
              field: "messages"
            }
          ]
        }
      ]
    };

    // Registrar log del Request
    const logId = Date.now();
    const newRequestLog = {
      id: logId,
      timestamp: new Date().toLocaleTimeString(),
      type: 'Request Webhook WhatsApp (POST)',
      payload: metaWebhookPayload
    };
    setLogs(prev => [newRequestLog, ...prev]);

    try {
      // 2. Enviar petición al webhook endpoint local
      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metaWebhookPayload)
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const responseData = await res.json();

      // Registrar log del Response
      const newResponseLog = {
        id: Date.now() + 1,
        timestamp: new Date().toLocaleTimeString(),
        type: 'Response Webhook Backend (JSON)',
        payload: responseData
      };
      setLogs(prev => [newResponseLog, ...prev]);

      // Agregar mensaje del bot a la UI del chat
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: responseData.text || 'Sin respuesta textual',
        suggestions: responseData.suggestions || [],
        action: responseData.action || null
      }]);

    } catch (err) {
      console.error("Error al despachar el webhook:", err);
      // Registrar log de error
      setLogs(prev => [{
        id: Date.now() + 2,
        timestamp: new Date().toLocaleTimeString(),
        type: 'Error de Red / Endpoint',
        payload: { message: err.message, note: "¿Está corriendo Firebase Cloud Functions localmente?" }
      }, ...prev]);

      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: `❌ Error al conectar con el backend: ${err.message}. Asegúrate de que el backend local esté ejecutándose en: ${endpointUrl}`
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.whatsappNumber && u.whatsappNumber.includes(searchTerm))
  );

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">
      {/* Header & Configuración del Endpoint */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--color-surface-container-low)] p-6 rounded-3xl border border-[var(--color-outline-variant)]">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-on-surface)] flex items-center gap-2">
            <Sparkles className="text-[var(--color-primary)]" />
            Consola del Asistente de IA (Veló AI)
          </h2>
          <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
            Simulador de WhatsApp e inspector de llamadas y Function Calling de Gemini
          </p>
        </div>
        <div className="flex-1 max-w-lg">
          <label className="block text-[10px] font-black uppercase text-[var(--color-on-surface-variant)] mb-1">
            Endpoint Webhook Local
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] text-xs rounded-xl px-4 py-2 flex-grow focus:outline-none focus:border-[var(--color-primary)]"
            />
            <button 
              onClick={() => setEndpointUrl('http://127.0.0.1:5001/pkt-erp/us-central1/velóAssistantEndpoint')}
              title="Restablecer por defecto"
              className="p-2 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl hover:bg-[var(--color-surface-variant)] transition-all text-[var(--color-on-surface-variant)]"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Configuración, OTP, Chat (7/12) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          
          {/* Panel de Identidad y OTP */}
          <div className="bg-[var(--color-surface-container-low)] p-6 rounded-3xl border border-[var(--color-outline-variant)] space-y-4">
            <h3 className="text-xs font-black uppercase text-[var(--color-primary)] tracking-widest flex items-center gap-2">
              <UserCheck size={16} />
              Selección de Identidad y Simulación de Token OTP
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Selector de Usuario */}
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)]">
                  Usuario a Simular
                </label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
                  <input
                    type="text"
                    placeholder="Filtrar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[var(--color-primary)] mb-2"
                  />
                </div>
                <select
                  onChange={(e) => {
                    const user = allUsers.find(u => u.id === e.target.value);
                    handleUserSelect(user || null);
                  }}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="">-- Seleccionar Usuario --</option>
                  {filteredUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.organizationName || 'Sin Org'}) - {u.whatsappNumber ? '🔗 Vinculado' : '❌ Desconectado'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Teléfono Manual */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)]">
                  Número de Teléfono (remitente)
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="Ej. 51987654321"
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <p className="text-[9px] text-[var(--color-on-surface-variant)]/60">
                  Debe coincidir con whatsappNumber del usuario para emular peticiones autenticadas.
                </p>
              </div>
            </div>

            {/* Visualización de OTP bindings */}
            {selectedUser && !selectedUser.whatsappNumber && (
              <div className="mt-4 p-4 bg-[var(--color-primary-container)]/20 border border-[var(--color-primary)]/10 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1.5">
                    <Clock size={14} />
                    Token OTP Activo para Vinculación
                  </p>
                  <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-0.5">
                    Este usuario aún no vinculó su WhatsApp. Busca si generó un código OTP:
                  </p>
                </div>
                <div>
                  {otpLoading ? (
                    <span className="text-xs text-[var(--color-on-surface-variant)]">Cargando...</span>
                  ) : otpBinding ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-black tracking-widest text-[var(--color-primary)] bg-white px-3 py-1 rounded-xl shadow-sm border border-[var(--color-primary)]/20">
                        {otpBinding.code}
                      </span>
                      <button
                        onClick={() => handleCopyOtp(otpBinding.code)}
                        className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 border transition-all text-slate-600"
                        title="Copiar Código"
                      >
                        {copiedOtp ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-red-500 bg-red-100/40 px-3 py-1 rounded-full border border-red-200">
                      Sin OTP activo
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Simulador Visual de Chat */}
          <div className="bg-[var(--color-surface-container-low)] rounded-3xl border border-[var(--color-outline-variant)] overflow-hidden flex flex-col h-[500px]">
            {/* Header del Chat */}
            <div className="bg-[var(--color-surface-container)] px-6 py-4 border-b border-[var(--color-outline-variant)] flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold relative">
                V
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="text-xs font-black text-[var(--color-on-surface)]">Veló AI Assistant</h4>
                <p className="text-[9px] text-green-500 font-bold">Online</p>
              </div>
            </div>

            {/* Área de Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-zinc-900/10">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-4 text-xs shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-[var(--color-primary)] text-white border-transparent rounded-tr-none' 
                      : 'bg-white text-[var(--color-on-surface)] border-slate-200 rounded-tl-none'
                  }`}>
                    {/* Texto del Mensaje */}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                    {/* Tarjeta de Acción Estructurada (Function Calling) */}
                    {msg.action && (
                      <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[var(--color-primary)]">
                          <Database size={12} />
                          Acción de IA: {msg.action.type}
                        </div>
                        <pre className="text-[10px] font-mono bg-white p-2 rounded border overflow-x-auto text-slate-600 max-h-24">
                          {JSON.stringify(msg.action.payload, null, 2)}
                        </pre>
                        <p className="text-[9px] text-slate-400 italic">
                          * Esta es una propuesta simulada. En la interfaz web, el usuario ve una tarjeta rica con botones de confirmación física.
                        </p>
                      </div>
                    )}

                    {/* Sugerencias (Pills) */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(sug)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-bold text-slate-700 rounded-lg transition-all"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input del Chat */}
            <div className="p-4 bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)]">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={manualPhone ? "Escribe un mensaje de WhatsApp..." : "Introduce un teléfono arriba para chatear..."}
                  disabled={!manualPhone}
                  className="flex-grow bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!manualPhone || !inputMessage.trim() || isSending}
                  className="p-3 bg-[var(--color-primary)] text-white rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-[var(--color-primary)]/20"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Columna Derecha: Visor de Logs de IA (5/12) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[var(--color-surface-container-low)] rounded-3xl border border-[var(--color-outline-variant)] p-6 space-y-4 flex flex-col h-[740px]">
            <div className="flex justify-between items-center border-b border-[var(--color-outline-variant)] pb-3">
              <h3 className="text-xs font-black uppercase text-[var(--color-on-surface)] flex items-center gap-2">
                <Terminal size={16} />
                Logs del Webhook & Gemini Engine
              </h3>
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] text-red-500 font-bold bg-red-100/50 hover:bg-red-100 border border-red-200 px-3 py-1 rounded-lg transition-all flex items-center gap-1"
              >
                <Trash2 size={12} />
                Limpiar Logs
              </button>
            </div>

            {/* Listado de Logs */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <Terminal size={32} className="text-slate-300" />
                  <p className="text-[10px] font-bold">Sin logs registrados en esta sesión.</p>
                  <p className="text-[9px] max-w-[200px]">Los payloads del webhook de WhatsApp aparecerán aquí en tiempo real al enviar mensajes.</p>
                </div>
              ) : (
                logs.map((log) => {
                  const hasFunctionCall = log.payload?.action || 
                    log.payload?.functionCalls || 
                    (log.payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body);
                  
                  // Analizar si contiene alguna llamada a herramienta
                  let actionBadge = null;
                  if (log.payload?.action) {
                    const actionType = log.payload.action.type;
                    actionBadge = (
                      <span className="px-2 py-0.5 text-[8px] font-black bg-purple-100 text-purple-700 border border-purple-200 rounded">
                        Tool: {actionType}
                      </span>
                    );
                  }

                  return (
                    <div key={log.id} className="bg-[var(--color-surface-container)] rounded-2xl border border-[var(--color-outline-variant)] p-4 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${log.type.includes('Request') ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                          {log.type}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {actionBadge}
                          <span className="text-[9px] text-[var(--color-on-surface-variant)]/60 font-semibold">{log.timestamp}</span>
                        </div>
                      </div>

                      <div className="relative group">
                        <pre className="text-[10px] font-mono bg-[var(--color-surface-container-low)] p-3 rounded-xl border border-[var(--color-outline-variant)] text-slate-700 overflow-x-auto max-h-48 custom-scrollbar">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(log.payload, null, 2))}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1.5 bg-white border rounded-lg shadow-sm transition-all hover:bg-slate-50 text-slate-500"
                          title="Copiar JSON"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
