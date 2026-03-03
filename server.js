const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

app.post("/webhook-encuesta", async (req, res) => {
  try {
    const data = req.body;

    const nombre = data.firstName || "";
    const apellido = data.lastName || "";
    const telefono = data.phone;
    const restaurante = data.restaurant || "Restaurante";

    let mensaje = "";

    if (restaurante.includes("Yoko")) {
      mensaje = `Hola ${nombre} ${apellido}, Yoko 🍣 agradece que hayas respondido nuestra encuesta. Disfruta tu recompensa 🎁`;
    }

    if (restaurante.includes("Ardeo")) {
      mensaje = `Hola ${nombre} ${apellido}, Ardeo agradece tu tiempo al responder nuestra encuesta. Aquí está tu recompensa 🎁`;
    }

    if (restaurante.includes("Great American")) {
      mensaje = `Hola ${nombre} ${apellido}, Great American agradece tu visita. Disfruta tu recompensa 🎁`;
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

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
