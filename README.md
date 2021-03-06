# Template para aplicações Node.js Web API com autenticação JWT
Esqueleto básico para o desenvolvimento de APIs com Node.js, autenticação jwt e Express js.  
Este template utiliza o [Helmet](https://github.com/helmetjs/helmet) para acrescentar certo nível proteção a aplicação.  
Foi utilizado o ES6 tendo em vista a sintaxe oficialmente suportada pelo Node.js.

## Como utilizar este template:
No terminal:  
```
$ git clone https://github.com/gacalves/Nodejs-JWT-Auth-Web-API-Application-Template.git my_new_project
$ cd my_new_project
$ npm i
$ npm start
```
Para testar a api pode-se utilizar uma ferramenta como o Postman ou no terminal:
```
$ curl -X POST -H "Content-Type: application/json" -d "{\"username\": \"test\", \"password\": \"Test@123\" }" http://localhost:3000/register
$ curl -X POST -H "Content-Type: application/json" -d "{\"username\": \"test\", \"password\": \"Test@123\" }" http://localhost:3000/auth
$ curl -X GET -H "Authorization: Bearer <replace_with_returned_access_token>" -d "{ \"id\": \"10\" }" http://localhost:3000/home
```

Por convenção deve-se:
* Criar a classe que representa o controller dentro da pasta controllers. O nome do arquivo deve terminar com "controller".
* Utilize classes do ES6 para definir o controller, sendo que o nome da classe deve terminar com "Controller".
* Cada método do controller, em que o seu nome iniciar com um dos verbos HTTP suportados, será automaticamente mapeado para uma rota no Express. Os verbos suportados podem ser verificados em `Router.supportedHttpVerbs`.  
Podem ser especificados métodos com nomes que não seguem esta convenção (não iniciando com um verbo http) embora, eles não serão mapeados automaticamente. Pode-se configurar rotas para estes métodos no arquivo `src/startup.js`, logo após a chamada ao método `Router.registerDefaultRoutes(....)`.

## Autenticação
A autenticação com JWT a nível de controller está disponível, porém é necessário que o controller herde de `SecuredController` (`src/controllers/secured-controller.js`).  
Caso não se deseje autenticação, o controller deve herdar de `BaseController` (`/src/controllers/base-controller.js`). No futuro, caso seja disponibilizado na linguagem algo semelhante aos annotations do .net, isto pode ser melhorado.  
A geração e validação de tokens de acesso é feita pela classe `JwtAuth` (`/src/security/jwt-auth.js`).

## Config
As configurações da aplicação podem ser definidas em `src/config/config.json`. Os valores definidos neste arquivo são carregados globalmente pelo `src/startup.json`.

Este arquivo já possui algumas configurações definidas:
* `jwt_secret`: senha privada utilizada para encriptar a senhas dos usuários registrados,
* `salt_hash_size`: o tamanho do salt utilizado no processo de hash.
* `jwt_expires_in_seconds`: por quantos segundos o token de acesso gerado é valido.
* `node_port`: em qual porta o Express irá escutar.

## Banco de dados
Este template está utilizando um banco de dados local.  
ATENÇÃO: Em produção deve-se configurar a aplicação para conectar a um SGBD.

## What's next?
* Autorização a nível de método para os controllers.
* Autorização granular através de papeis.

Contribuições a este repositório são bem-vindas!
