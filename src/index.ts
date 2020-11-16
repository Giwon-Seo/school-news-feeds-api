import app from "./app"
import config from "./config/config";


app.listen(config.port,()=>{
    console.log('http://localhost:'+ config.port+' start' )
})