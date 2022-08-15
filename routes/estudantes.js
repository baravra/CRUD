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
        console.log("GET /estudantes/id => consultando aluno específico");

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
        console.log("POST /notaTotal: " + notaTotal + " => consultando nota total de aluno em uma matéria")
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
        console.log("POST /media: " + media + " => consultando média de aluno em uma matéria")
    } catch (error) {
        next(error)
    }
})

/* ----- ENDPOINT PARA CRIAR NOVO REGISTRO ----- */
/* ----- RECEBE DE PARAMETROS O NOME DO ALUNO, A MATÉRIA A ATIVIDADE E O VALOR ----- */
router.post("/add" , async(req, res, next) => {
    try {
        let parametros = req.body;//Salvando os valores do body na variavel parametros

        if(!parametros.aluno || !parametros.materia || !parametros.atividade || !parametros.valor){ // Verificacao se os valores estao preenchidos
            throw new Error("Campos 'ALUNO', 'MATERIA', 'ATIVIDADE' e 'VALOR' são obrigatórios!");
        }

        const data = JSON.parse(await readFile(global.fileName)); // Colocando o arquivo JSON traduzido na variavel data
        const date = new Date();

        parametros = { // Passando os dados recebidos para um objeto
            id: data.nextId++,
            student: parametros.aluno,
            subject: parametros.materia,
            type: parametros.atividade,
            value: parametros.valor,
            timestamp: date
        };
        
        data.grades.push(parametros); // Adicionou os novos dados no fim do array com as informacoes gerais
        await writeFile(global.fileName, JSON.stringify(data, null, 2)); // Escreve novamente o arquivo adicionando os dados novos

        res.send(parametros) // Envia a resposta
        console.log("POST /add " + JSON.stringify(parametros) + " => criar novo registro")

    } catch (error) {
        next(error)
    }
})

/* ----- ENDPOINT PARA ATUALIZAR REGISTRO ----- */
/* ----- RECEBE DE PARAMETROS O ID DO REGISTRO, NOME DO ALUNO, A MATÉRIA A ATIVIDADE E O VALOR ----- */
router.put("/", async(req,res,next) => {
    try {
        let parametros = req.body;//Salvando os valores do body na variavel parametros

        if(!parametros.id || !parametros.aluno || !parametros.materia || !parametros.atividade || !parametros.valor){ // Verificacao se os valores estao preenchidos
            throw new Error("Campos 'ID', 'ALUNO', 'MATERIA', 'ATIVIDADE' e 'VALOR' são obrigatórios!");
        }
        const data = JSON.parse(await readFile(global.fileName)); // Colocando o arquivo JSON traduzido na variavel data
        const index = data.grades.findIndex(a => a.id === parametros.id); // Procura o registro de numero do id informado nos parametros

        if (index === -1) { // Caso nao encontre o registro irá apresentar esse erro
            throw new Error("Registro não encontrado.");
        }

        /* Atualiza os valores do array com os dados gerais */
        data.grades[index].student = parametros.aluno;
        data.grades[index].subject = parametros.materia;
        data.grades[index].type = parametros.atividade;
        data.grades[index].value = parametros.valor;

        await writeFile(global.fileName, JSON.stringify(data, null, 2)); // Escreve novamente o arquivo atualizando os dados

        res.send(parametros) // Envia a resposta
        console.log("PUT / " + JSON.stringify(parametros) + " => atualizar registro")

    } catch (error) {
        next(error)
    }
})

/* ----- ENDPOINT PARA EXCLUIR REGISTRO ----- */
/* ----- RECEBE DE PARAMETROS O ID DO REGISTRO  ----- */
router.delete("/:id", async(req,res,next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName)); // Colocando o arquivo JSON traduzido na variavel data 
        data.grades = data.grades.filter( // Atualizando a variavel data com todos os registros do arquivo tirando o de id informado
            account => account.id !== parseInt(req.params.id));    
        await writeFile(global.fileName, JSON.stringify(data, null, 2)); // Escreve novamente o arquivo atualizando os dados
        
        res.end()
        console.log("DELETE / " + req.params.id + " => excluir registro")

    } catch (error) {
        next(error)
    }
})

/* ----- ENDPOINT PARA CONSULTAR TRES MELHORES ALUNOS DE UMA MATERIA ----- */
/* ----- RECEBE DE PARAMETROS O ID DO REGISTRO  ----- */
router.post("/topTres", async(req,res,next) => {
    try {
        let parametros = req.body;//Salvando os valores do body na variavel parametros

        if(!parametros.materia){ // Verificacao se os valores estao preenchidos
            throw new Error("Campo 'MATERIA' obrigatório!");
        }
        const data = JSON.parse(await readFile(global.fileName)); // Colocando o arquivo JSON traduzido na variavel data 
        var filtroMateria = data.grades.filter(data => data.subject == parametros.materia) //Filtrando nos dados a matéria informada no body
        filtroMateria.sort(function (a, b) { // Ordernando em ordem decrescente com base a nota de cada aluno
            return (b.value - a.value);
        });
        
        var i = 0; // Iniciando variavel igual a zero para percorrer while
        var array = [] // Iniciando array vazio para salvar os dados esejados
        while(i < 3){ // Pegando o top 3 maiores notas
            array.push(filtroMateria[i]); // Adicionando no fim do array
            i++;
        }

        res.send(array) // Enviando resposta
        console.log("POST /topTres => retonando os tres maiores valores da materia " + parametros.materia)
    } catch (error) {
        next(error)
    }
})

export default router; // Exportando as rotas para o index