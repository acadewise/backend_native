const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/api/index');
const adminRoutes = require('./src/routes/admin/index')
const webRoutes = require('./src/routes/web/index');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000

app.use(express.json())

app.use(cors());

app.use(express.static(path.join(__dirname, './public')));


// Setting a middleware  to inform user for maintenance work
// app.use((req, res, next) => {
//     res.status(503).send('The server maintenance work going on, pleas try later')
// })

app.use('/', apiRoutes)
app.use('/', adminRoutes)
app.use('/', webRoutes)


app.listen(PORT, () => {
    console.log("App listing on PORT", PORT)
})