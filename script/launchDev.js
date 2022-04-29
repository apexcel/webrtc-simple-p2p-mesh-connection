const { spawn } = require('child_process');

const client = spawn('npm', ['run', 'dev', '-w', 'client']);
const server = spawn('npm', ['run', 'dev', '-w', 'server']);

client.stdout.on('data', data => {
    console.log('CLIENT:', String(data).trim());
})

server.stdout.on('data', data => {
    console.log('SERVER:', String(data).trim());
})