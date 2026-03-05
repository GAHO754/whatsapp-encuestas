const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

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
const urlCupon = `https://whatsapp-encuestas.onrender.com/cupon.html?img=${encodeURIComponent(imagenSeleccionada)}&cupon=${cupon}&restaurante=${encodeURIComponent(restaurante)}`;


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

    console.log("📲 SIMULACIÓN WHATSAPP");
    console.log("Cliente:", nombre, apellido);
    console.log("Teléfono:", telefono);
    console.log("Mensaje:", mensaje);
    console.log("Cupón generado:", cupon);
    console.log("Imagen enviada:", imagenSeleccionada);




    console.log("Mensaje enviado a:", telefono);

   res.json({
  status: "Cupón generado correctamente",
  cliente: `${nombre} ${apellido}`,
  telefono: telefono,
  cupon: cupon,
  imagen: imagenSeleccionada
});


  } catch (error) {
    console.error("Error enviando WhatsApp:", error);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
