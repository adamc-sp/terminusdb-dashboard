// const server = localStorage.getItem("terminusdb-server-override") || process.env.TERMINUSDB_SERVER || window.location.origin
const server = 'http://127.0.0.1:6363/'

//there is no default key
//let key=  localStorage.getItem("terminusdb-key-override") || process.env.TERMINUSDB_KEY 

//const userName=  localStorage.getItem("terminusdb-user-override") || process.env.TERMINUSDB_USER 

const connection_type = process.env.CONNECTION_TYPE || 'LOCAL'


export const localSettings = {
    server : server,
    connection_type :connection_type
}

