# Tutorial

Logo abaixo fica o passo a passo de inicialização do backend:

## Passo 1:

-   Crie um arquivo chamado .env na pasta do projeto e copie o conteudo igual ao .env.example mudando as informações para as correspondentes do seu ambiente

## Passo 2:

-   Rode o comando 'npm install' para instalar as dependências do projeto

## Passo 3:

-   Rode o comando 'docker compose up -d' para criar uma instancia do banco de dados postgresql

## Passo 4:

-   Rode o comando 'npx prisma migrate deploy' para popular o banco de dados

## Passo 5:

-   Com o docker rodando (banco de dados), rode o comando 'npm run start:dev' para iniciar a api
