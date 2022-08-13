import express from "express"; // Construcao de servidor
import {promises as fs} from "fs"; // Ler e escrever json

const {readFile, writeFile} = fs // Pegando os metodos de ler e escrever arquivos

const router = express.Router(); // Declarando variavel para pegar as rotas

/* ----- ENDPOINT PARA RETORNAR TODOS OS DADOS DO ARQUIVO ----- */
router.get("/", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName)); // Colocando o arquivo JSON traduzido na variavel data
        delete data.nextId; // Deletando a propriedade nextId do JSON
        res.send(data); // Enviando a variavel data como resposta da requisicao
        console.log("GET /estudantes => retornar todos os dados do arquivo");
    } catch (err) {
        next(err);
    }
});

/* ----- ENDPOINT PARA RETORNAR ALUNA ESPECIFICO COM SEU ID DE PARAMETRO ----- */
router.get("/:id", async(req, res, next) => { // Requisicao do tipo get com parametro do id
    try{
        const data = JSON.parse(await readFile(global.fileName)); // Colocando o arquivo JSON traduzido na variavel data
        const estudante = data.grades.find( // Passando os dados retornados no find
            estudante => estudante.id === parseInt(req.params.id) // Pegando o valor do estudante com o id informado na requisicao
        )
        res.send(estudante) // Enviando os dados de resposta
    } catch(err){
        next(err);
    }
})  

/* ----- ENDPOINT PARA CONSULTAR A NOTA TOTAL DE UM ALUNO EM UMA DISCIPLINA ----- */
/* ----- RECEBE DE PARAMETROS O NOME DO ALUNO E DA MATERIA ----- */
router.post("/notaTotal", async(req, res, next) => { // Requisicao do tipo post com parametros no body
    try{
        let estudante = req.body //Salvando os valores do body na variavel estudante

        if(!estudante.aluno || !estudante.materia){ // Verificacao se os valores estao preenchidos
            throw new Error("Aluno e matéria são obrigatórios!");
        }

        const data = JSON.parse(await readFile(global.fileName)) // Colocando o arquivo JSON traduzido na variavel data
        var filtroAluno = data.grades.filter( data => data.student == estudante.aluno) // Filtrando nos dados do JSON todos as informacoes que o estudante é o nome informado no body
        var filtroMateria = filtroAluno.filter(data => data.subject == estudante.materia) //Filtrando nos dados dos alunos a matéria informada no body

        var notaTotal = 0; // Iniciando variavel com valor igual a zero

        for(var i = 0; i < filtroMateria.length; i++){ // Laco de repeticao para que as notas de cada atividade sejam somadas
            notaTotal += filtroMateria[i].value
        }

        res.send(notaTotal.toString()) // Enviando os dados de resposta
        console.log("POST /notaTotal: " + notaTotal)
    }catch(err){
        next(err)
    }
})

/* ----- ENDPOINT PARA CONSULTAR A MEDIA DE UM ALUNO EM UMA DISCIPLINA ----- */
/* ----- RECEBE DE PARAMETROS O NOME DO ALUNO E DA MATERIA ----- */
router.post("/media", async(req,res,next) =>{
    try {
        let parametros = req.body;//Salvando os valores do body na variavel parametros

        if(!parametros.aluno || !parametros.materia){ // Verificacao se os valores estao preenchidos
            throw new Error("Aluno e matéria são obrigatórios!");
        }

        const data = JSON.parse(await readFile(global.fileName)) // Colocando o arquivo JSON traduzido na variavel data
        var filtroAluno = data.grades.filter( data => data.student == parametros.aluno) // Filtrando nos dados do JSON todos as informacoes que o estudante é o nome informado no body
        var filtroMateria = filtroAluno.filter(data => data.subject == parametros.materia) //Filtrando nos dados dos alunos a matéria informada no body

        var notaTotal = 0; // Iniciando variavel com valor igual a zero
        var media = 0; // Iniciando variavel com valor igual a zero
        
        for(var i = 0; i < filtroMateria.length; i++){ // Laco de repeticao para que as notas de cada atividade sejam somadas
            notaTotal += filtroMateria[i].value
        }
        media = notaTotal / filtroMateria.length; // Pegando a media das notas do aluno na materia

        res.send(media.toString()) // Enviando os dados de resposta
        console.log("POST /media: " + media)
    } catch (error) {
        next(error)
    }
})



export default router; // Exportando as rotas para o index