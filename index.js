const app = require("./app")

const PORT = 4000;

app.get("/",(req, res)=>{
    res.cookie("kokok","my home is in delhi")
    console.log('Cookies: ', req.cookies)
    res.send("HEllo to you")
})

app.listen(PORT,()=>{
    console.log(`Listening at port http://localhost:${PORT}`);
})