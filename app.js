//jshint esversion:6

//Importando as bibliotecas que serao usadas
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose")

const conteudoHome = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const conteudoSobre = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const conteudoContato = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//Inicando o Express
const app = express();

//Necessario para usar o EJS
app.set('view engine', 'ejs');
app.use(express.static("public"));

//Necessario para usar o BodyParser
app.use(bodyParser.urlencoded({extended: true}));

//Conectando á DB: 
mongoose.connect("mongodb+srv://admin:Filipeco123@cluster0.uaaw1ki.mongodb.net/blogDB", {useNewUrlParser: true})

//Criando um SCHEMA para as informações que serão postadas
const schemaPost = {
  titulo: String,
  conteudo : String
}
           
//Criando/Conectando a COLLECTION POST no DB
const Post = mongoose.model("Post",schemaPost);


//let posts = [];

app.get("/", function(req, res){

  //Pegando todos os POSTS --> O metodo find deve ser Async, por isso o uso do then
  Post.find().then(function(postsEncontrados){
    
      //Renderizando o EJS home com os postsEncontrados
      res.render("home", {
        conteudoInicial: conteudoHome,
        //Passando os POSTS encontrados para o EJS
        posts: postsEncontrados
      });
  })

});

app.get("/sobre", function(req, res){
  res.render("sobre", {conteudoSobre: conteudoSobre});
});

app.get("/contato", function(req, res){
  res.render("contato", {conteudoContato: conteudoContato});
});

app.get("/criar", function(req, res){
  res.render("criar");
});

app.post("/criar", function(req, res){

  const post = new Post({
    titulo : req.body.postTitulo,
    conteudo : req.body.postBody
  })

  
  post.save()
  console.log("POST salvo")

  //Codigo para salvar no servidor local / sem DB
  /*const post = {
    titulo: req.body.postTitulo,
    conteudo: req.body.postBody
  };

  posts.push(post);
  */
  res.redirect("/");
  
});

                //:postName é a rota custom.
app.get("/posts/:postName", function(req, res){

  //Pegando a parte customizada/dinamica da URL
  const tituloSolicitado = _.lowerCase(req.params.postName);

  Post.find().then((postsEncontrados) => { 
    postsEncontrados.forEach((post) => {

      const tituloAtual = _.lowerCase(post.titulo);

      //Verificando se há um POST com o titulo inputado pelo usuario
      if (tituloAtual === tituloSolicitado) {

        //Renderizando o EJS post, passando como parametros o titulo e conteúdo
        res.render("post", {
          titulo: post.titulo,
          conteudo: post.conteudo,
          id: post._id
       
        });
      }
    });
  });
})

app.post("/delete/:idDeletado",function(req,res){
  
  //Pegando o ID, que está na URL
  const idDeletado = req.params.idDeletado
  
  //Pegando o item com ID que deve ser deletado e 
  Post.findByIdAndDelete(idDeletado).then((err, docDeletado) => {
    if (!err){
      console.log("Deletado: ", docDeletado);
    }
    else{
        console.log(err);
    }
});

  res.redirect('/')

})

app.listen(3000, function() {
  console.log("Server ONLINE");
});
