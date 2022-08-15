# JS_CRUD

## Atividade realizada com JavaScript para desenvolvimento de requisicoes de uma API.

Para testar o código seguem os passos a serem feitos:

- Rodar no terminal o seguinte comando => ao executar esse comando o servidor será iniciado

```
npm run dev
```

- Acesse uma plataforma para teste de APIs como o postman ou o insomnia

<hr>

## LINKS PARA TESTE

- Endpoint para retornar todos os dados do arquivo JSON (método GET):
```
localhost:1/estudantes
```
- Endpoint para retornar aluno específico (método GET):
```
localhost:1/estudantes/{id-desejado}
```
- Endpoint para consultar a nota total de um aluno em uma matéria junto com parametros de exemplo (método POST):
```
localhost:1/estudantes/notaTotal
{
"aluno": "Loiane Groner",
"materia": "01 - JavaScript"
}
```
- Endpoint para consultar media de aluno em uma disciplina recebendo o nome do aluno e da matéria de parametros (POST):
```
localhost:1/estudantes/media
{
"aluno": "Loiane Groner",
"materia": "01 - JavaScript"
}
```
- Endpoint para criar novo registro. Aluno, matéria, atividade e nota são obrigatórios (POST):
```
localhost:1/estudantes/add
{
"aluno": "NOME",
"materia": "MATERIA",
"atividade": "ATIVIDADE",
"valor": 10
}
```
- Endpoint para atualizar registro. ID, aluno, matéria, atividade e nota são obrigatórios (PUT):
```
localhost:1/estudantes/
{
"id": 1
"aluno": "NOME",
"materia": "MATERIA",
"atividade": "ATIVIDADE",
"valor": 10
}
```
- Endpoint para excluir registro. ID é obrigatórios (DELETE):
```
localhost:1/estudantes/{id-do-registro}
{
"id": 1
}
```
- Endpoint para consultar tres maiores notas em uma matéria. Matéria é obrigatória (POST):
```
localhost:1/estudantes/topTres
{
"materia": "01 - JavaScript"
}
```
