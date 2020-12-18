const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index.html')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})