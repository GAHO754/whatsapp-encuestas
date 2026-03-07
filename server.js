const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
// 🔹 DATOS WHATSAPP
const WHATSAPP_TOKEN = "EAALZB4BnISHgBQxIAv1Sj2OawTSZAguKXtt2qmlMKeKdYFEG73RPuUW5ZCert6bv112yKXoBVBEpbvRGNYByJgWt5KZCAIdo6PYiyTxzw2ZAZC4YKMrZCvqQ8DshADFpFNG41ChZAJQRoGhDjK4WJL723SvoR43SDeZCMP2hXdU1FWjO0cdHhj6jr7ZAWRIwKi2i32QjNEGRoBGvInXLfZCswwXsLp6SINmvzx0veENh2a3f6w8XzjaGywbG5nxgth5MRkJyI5OaceMxxrM4eh7u6qbA5OH8QZDZD";
const PHONE_NUMBER_ID = "978000385401936";

// 🔹 ESTA LÍNEA PERMITE CARGAR HTML
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor activo 🚀");
});

// Log de peticiones
app.use((req, res, next) => {
  console.log("Nueva petición:", req.method, req.url);
  next();
});
// 📌 IMÁGENES POR RESTAURANTE
const imagenes = {
  Yoko: [
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/edemames_1723744004613.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/gin-zen_1723744008528.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/ronin_1723744012375.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/yakimeshi_1723744016067.webp"
  ],
  Ardeo: [
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/betabel-braza_1723744190857.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/flamingo_1723744194875.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/pastel-de-pistache_1723744198972.webp"
  ],
  GreatAmerican: [
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/barro-tamarindo_1723744333488.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/coliflor-brasa_1723744336930.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/pink-velvet_1723744340591.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/queso-fundido_1723744344149.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/tapioca_1723744347387.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/coliflor-brasa_1723744336930_1749175243548.webp"
  ],
  Muzza: [
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/tikitaliano_1723744236052.webp",
    "https://evaadev.blob.core.windows.net/media/greatameri283/images/rosa-ahumado_1723744239638.webp"
  ]
};

// Función imagen aleatoria
function obtenerImagenAleatoria(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}
// 📲 FUNCIÓN PARA ENVIAR WHATSAPP
async function enviarWhatsApp(telefono, nombre, restaurante, cupon, urlCupon) {

const url = `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`;

const body = {
  messaging_product: "whatsapp",
  to: telefono.replace("+",""),
  type: "template",
  template: {
    name: "cupon_encuesta",
    language: {
      code: "es_MX"
    },
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: nombre },
          { type: "text", text: restaurante },
          { type: "text", text: cupon },
          { type: "text", text: urlCupon }
        ]
      }
    ]
  }
};


const response = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
});

const data = await response.json();
console.log("Respuesta WhatsApp API:", data);

}

// 🔐 VERIFICACIÓN DEL WEBHOOK DE WHATSAPP
const VERIFY_TOKEN = "token_whatsapp_123";

app.get("/webhook-encuesta", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("Intento de verificación webhook");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    console.log("Error verificando webhook");
    res.sendStatus(403);
  }

});


// 🔥 WEBHOOK REAL
app.post("/webhook-encuesta", async (req, res) => {
  try {
    console.log("WEBHOOK RECIBIDO 🚀");
    console.log(req.body);

    const nombre = req.body.customer?.firstName || "";
    const apellido = req.body.customer?.lastName || "";
    let telefono = req.body.customer?.phone || "";
    const restaurante = req.body.survey?.name || "";

    if (!telefono) {
  console.log("No hay teléfono");
  return res.status(200).send("Sin teléfono");
}

telefono = telefono.startsWith("+") ? telefono : `+${telefono}`;

let mensaje = "";
let imagenSeleccionada = "";

// 🎟 Generar cupón único
const cupon = `${restaurante.toUpperCase().replace(/\s/g, "")}-${Math.floor(10000 + Math.random() * 90000)}`;

if (restaurante.includes("Yoko")) {
  mensaje = `Hola ${nombre}, Yoko 🍣 agradece que hayas respondido nuestra encuesta. Disfruta tu recompensa 🎁`;
  imagenSeleccionada = obtenerImagenAleatoria(imagenes.Yoko);
}

else if (restaurante.includes("Ardeo")) {
  mensaje = `Hola ${nombre}, Ardeo agradece tu tiempo al responder nuestra encuesta. 🎁`;
  imagenSeleccionada = obtenerImagenAleatoria(imagenes.Ardeo);
}

else if (restaurante.includes("Great American")) {
  mensaje = `Hola ${nombre}, Great American agradece tu visita. 🎁`;
  imagenSeleccionada = obtenerImagenAleatoria(imagenes.GreatAmerican);
}
else if (restaurante.includes("Muzza")) {
  mensaje = `Hola ${nombre}, Muzza agradece mucho tu visita. 🎁`;
  imagenSeleccionada = obtenerImagenAleatoria(imagenes.Muzza);
}
else {
  mensaje = `Hola ${nombre}, gracias por responder nuestra encuesta 🎁`;
}
// 🔗 Generar URL del cupón
const urlCupon = `https://whatsapp-encuestas.onrender.com/cupon.html?img=${encodeURIComponent(imagenSeleccionada)}&cupon=${cupon}&restaurante=${encodeURIComponent(restaurante)}`;

    console.log("📲 SIMULACIÓN WHATSAPP");
    console.log("Cliente:", nombre, apellido);
    console.log("Teléfono:", telefono);
    console.log("Mensaje:", mensaje);
    console.log("Cupón generado:", cupon);
    console.log("Imagen enviada:", imagenSeleccionada);

    console.log("Mensaje enviado a:", telefono);
    // 📲 ENVIAR WHATSAPP REAL
  await enviarWhatsApp(
    telefono,
    nombre,
    restaurante,
    cupon,
    urlCupon
  );

   res.json({
    status: "Cupón generado correctamente",
    cliente: `${nombre} ${apellido}`,
    telefono: telefono,
    cupon: cupon,
    imagen: imagenSeleccionada,
    url: urlCupon
  });

  } catch (error) {
    console.error("Error enviando WhatsApp:", error);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
