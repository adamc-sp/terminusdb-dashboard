// const server = localStorage.getItem("terminusdb-server-override") || process.env.TERMINUSDB_SERVER || window.location.origin
const server = `${window.location.origin}/terminusdb/`;

//there is no default key
//let key=  localStorage.getItem("terminusdb-key-override") || process.env.TERMINUSDB_KEY 

//const userName=  localStorage.getItem("terminusdb-user-override") || process.env.TERMINUSDB_USER 

const connection_type = process.env.CONNECTION_TYPE || 'LOCAL'
const omit_history = process.env.OMIT_HISTORY === 'true' || false


export const localSettings = {
    server : server,
    connection_type,
    omit_history
}

