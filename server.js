const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Servidor activo 🚀");
});

app.get("/test-webhook", (req, res) => {
  console.log("Webhook de prueba recibido");
  res.send("Ruta test-webhook funcionando");
});


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);


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


// 📌 Función para elegir imagen aleatoria
function obtenerImagenAleatoria(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}


app.post("/webhook-encuesta", async (req, res) => {
  try {
    console.log("Webhook recibido:", req.body);

    const nombre = req.body.firstName || req.body.nombre || "";
    const apellido = req.body.lastName || req.body.apellido || "";

    let telefono =
      req.body.phone ||
      req.body.phone_number ||
      req.body.telefono;

    const restaurante =
      req.body.restaurant ||
      req.body.location ||
      "Restaurante";

    if (!telefono) {
      return res.status(400).send("No se recibió teléfono");
    }

    // Limpiar teléfono
    telefono = telefono.replace(/\D/g, "");

    let mensaje = "";
    let imagenSeleccionada = "";

    // YOKO
    if (restaurante.includes("Yoko")) {
      mensaje = `Hola ${nombre}, Yoko 🍣 agradece que hayas respondido nuestra encuesta. Disfruta tu recompensa 🎁`;
      imagenSeleccionada = obtenerImagenAleatoria(imagenes.Yoko);
    }

    // ARDEO
    else if (restaurante.includes("Ardeo")) {
      mensaje = `Hola ${nombre}, Ardeo agradece tu tiempo al responder nuestra encuesta. 🎁`;
      imagenSeleccionada = obtenerImagenAleatoria(imagenes.Ardeo);
    }

    // GREAT AMERICAN
    else if (restaurante.includes("Great American")) {
      mensaje = `Hola ${nombre}, Great American agradece tu visita. 🎁`;
      imagenSeleccionada = obtenerImagenAleatoria(imagenes.GreatAmerican);
    }

    // MUZZA
    else if (restaurante.includes("Muzza")) {
      mensaje = `Hola ${nombre}, Muzza agradece mucho tu visita. Disfruta tu recompensa 🎁`;
      imagenSeleccionada = obtenerImagenAleatoria(imagenes.Muzza);
    }

    else {
      mensaje = `Hola ${nombre}, gracias por responder nuestra encuesta 🎁`;
    }

    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:+${telefono}`,
      body: mensaje,
      mediaUrl: imagenSeleccionada ? [imagenSeleccionada] : []
    });

    res.status(200).send("Mensaje enviado con imagen");

  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error");
  }
});


app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
