/**
 * Declaraciones de herramientas (Tools) compatibles con la Gemini API.
 * Mapean la intención en lenguaje natural a parámetros estructurados.
 */
const tools = [
  {
    name: "queryStock",
    description: "Consulta la cantidad disponible de un producto o insumo en el inventario o almacén de la empresa.",
    parameters: {
      type: "OBJECT",
      properties: {
        productName: {
          type: "STRING",
          description: "El nombre o descripción del producto o insumo a buscar (ej. 'pala', 'cemento')."
        },
        type: {
          type: "STRING",
          description: "Opcional. Indica si es 'inventario' (producto terminado) o 'bodega' (materia prima/insumo).",
          enum: ["inventario", "bodega"]
        }
      },
      required: ["productName"]
    }
  },
  {
    name: "createSaleDraft",
    description: "Prepara una propuesta o borrador de venta/cotización para un cliente específico. Esto NO guarda el documento directamente, sino que genera un borrador visual para que el usuario lo confirme en la pantalla.",
    parameters: {
      type: "OBJECT",
      properties: {
        clientName: {
          type: "STRING",
          description: "El nombre del cliente al que se le realiza la venta o cotización."
        },
        products: {
          type: "ARRAY",
          description: "Lista de productos incluidos en el borrador de venta.",
          items: {
            type: "OBJECT",
            properties: {
              name: {
                type: "STRING",
                description: "Nombre del producto (ej. 'Pala reforzada')."
              },
              quantity: {
                type: "INTEGER",
                description: "Cantidad de unidades a vender."
              }
            },
            required: ["name", "quantity"]
          }
        }
      },
      required: ["clientName", "products"]
    }
  },
  {
    name: "deductInventory",
    description: "Prepara una solicitud de salida o deducción de stock de un material/insumo de bodega por motivos de merma o consumo interno. Genera una propuesta para confirmación táctil del usuario.",
    parameters: {
      type: "OBJECT",
      properties: {
        productName: {
          type: "STRING",
          description: "El nombre del insumo o material de bodega a descontar."
        },
        quantity: {
          type: "NUMBER",
          description: "La cantidad física a egresar."
        },
        reason: {
          type: "STRING",
          description: "La razón detallada del egreso (ej. 'Rotura', 'Uso en obra', 'Merma')."
        }
      },
      required: ["productName", "quantity", "reason"]
    }
  }
];

module.exports = tools;
