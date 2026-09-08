const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuariosRoutes);

const parcelaRoutes = require('./routes/parcelaRoutes');
app.use('/parcelas', parcelaRoutes);

const prediccionroutes= require("./routes/prediccion.routes")
app.use("/prediccion", prediccionroutes);