const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const httpSignature = require('http-signature');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

app.use(/*verfy signature and get the public key */)
app.use(koaBody());
app.use(async function(ctx) {
    if (ctx.method === 'GET' || ctx.path === '/token'){
        const key = ctx.rquest.key;
        const hash = ctx.request.body.hash;
        console.log(web3.eth.getTransaction(hash));
    }
});

app.listen(3000);