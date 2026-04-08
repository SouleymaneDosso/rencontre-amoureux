const http = require('http')
const app = require("./app")

const portnormal = val =>{
    const port = parseInt(val, 10)

    if(isNaN(port)){
    return val;
}

if(port >= 0){
return port; 
}
return false;

}

const port = portnormal(process.env.PORT||'3000')
app.set("port", port)
const server = http.createServer(app)

const errorEcoute = error =>{
    if(error.syscall !== "listen"){
        throw error
    }
    const address = server.address();
const bind = typeof address === 'string' ? 'pipe ' + address : 'port: '  + port;
switch(error.code){
    case 'EACCES':
        console.error(bind + " Vous avez besoin de l'autorisation de l'admin")
        process.exit(1)
        break

    case 'EADDRINUSE':
        console.error(bind + "Le port est occupé")
        process.exit(1)
        break

        default: 
        throw error;
}
};

server.on("error", errorEcoute)
server.on('listening', ()=>{
   const address = server.address();
   const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
   console.log("le server est lancé sur l'address: ", bind)

});
server.listen(port);

