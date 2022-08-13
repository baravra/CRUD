/* ----- IMPORTANDO MODULOS ----- */
import estudantesRouter from "./routes/estudantes.js"; //Metodos de requisicao
import express from "express"; // Construcao de servidor
import {promises as fs, read} from "fs"; // Ler e escrever json

/* ----- CRIANDO VARIAVEIS ----- */
const {readFile, writeFile } = fs // Pegando os metodos de ler e escrever arquivos
const app = express(); // Chamando a funcao do express

global.fileName = "grades.json"; // Salvando o nome do arquivo com os dados


/* ----- CONFIGURANDO EXPRESS ----- */
app.use(express.json()); // Método para reconhecer o objeto de entrada como um objeto JSON
app.use(express.static("public")); // Nome da pasta nao faz parte da URL, express busca direto os arquivos
app.use("/estudantes", estudantesRouter); //Criando requisicao default

app.listen(1, async () => { // Quando acessar a porta 1
    try{
        await readFile(global.fileName); // Ler o arquivo com os dados
        console.log("API STARTED");
    }catch(err){
        const initialJSON = { // Iniciar objeto
            nextId: 1,
            grades: []
        };
        writeFile(global.fileName, JSON.stringify(initialJSON)).then(() => { // Escrever no arquivo os dados criados caso esteja vazio
            console.log("API STARTED AND FILE CREATED")
        }).catch(err =>{
            console.log(err)
        })
    }
})