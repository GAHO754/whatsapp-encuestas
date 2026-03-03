const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Servidor de encuestas funcionando 🚀");
});

app.get("/test", async (req, res) => {
  try {
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+5216568196543",
      body: "Prueba de WhatsApp desde Render 🚀"
    });

    res.send("Mensaje enviado por WhatsApp");
  } catch (error) {
    console.error(error);
    res.send("Error enviando mensaje");
  }
});
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

app.post("/webhook-encuesta", async (req, res) => {
  try {
    console.log("Webhook recibido:", req.body);

    const nombre = req.body.firstName || req.body.nombre || "";
    const apellido = req.body.lastName || req.body.apellido || "";
    const telefono =
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

    let mensaje = `Hola ${nombre} ${apellido}, gracias por responder la encuesta. 🎁`;

    if (restaurante.includes("Yoko")) {
      mensaje = `Hola ${nombre}, Yoko 🍣 agradece que hayas respondido nuestra encuesta. Disfruta tu recompensa 🎁`;
    }

    if (restaurante.includes("Ardeo")) {
      mensaje = `Hola ${nombre}, Ardeo agradece tu tiempo al responder nuestra encuesta. 🎁`;
    }

    if (restaurante.includes("Great American")) {
      mensaje = `Hola ${nombre}, Great American agradece tu visita. 🎁`;
    }
    if (restaurante.includes("Muzza")) {
      mensaje = `Hola ${nombre} ${apellido}, Muzza agradece mucho tu visita. Disfruta tu recompensa gracias buen dia 🎁`;
    }

     await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:+${telefono}`,
      body: mensaje
    });

    res.status(200).send("Mensaje enviado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

