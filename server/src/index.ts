import express from "express"

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req,res) => {
    res.status(200).send('Hello world')
})


app.listen(PORT, () => console.log('Server started and listening at port:', PORT));