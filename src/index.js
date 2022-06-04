const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

// Middleware
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer) {
        return response.status(400).json({ error: "Customer not found" });
    }

    request.customer = customer; // "request.nomeDoRequest = obj", para repassar o a informação dentro do middleware para demais rotas, nesse caso o "customer"

    return next();
}

app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    );
    
    if(customerAlreadyExists) { // se existir um cpf, retorna um error
        return response.status(400).json({ error: "Customer alreay exists!" })
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send();
});

// app.use(verifyIfExistsAccountCPF); todas as requisições abaixo vão receber o Middleware

app.get("/statement/", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    
    return response.json(customer.statement);
});


app.listen(3333);



/** 
 * Middlewares
 Função que fica entre nosso request e response
 * - Validação de Token
 * - Validações
 */