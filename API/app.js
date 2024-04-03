const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/categories/:categoryName/products', async (req, res) => {
    console.log(req.params.categoryName);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})