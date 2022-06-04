const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];
/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */
// '/account' é o nome do recurso
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

app.listen(3333);