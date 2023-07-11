//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require("lodash");

const homeStartingContent = `Welcome to our sophisticated blog website. Here, you will discover a rich collection of meticulously curated articles spanning a diverse range of subjects. Delve into a captivating world of knowledge, where each article is meticulously researched and thoughtfully presented to ensure a seamless blend of information and entertainment. From intriguing travel accounts to cutting-edge technological insights, from delectable culinary explorations to insightful literary critiques, our blog covers a broad spectrum of topics, catering to the discerning tastes of our esteemed readers.\n` +
                            `\nWant to know how to get started ??\n` + `Just append "/compose" in the route and get going. 😃` 
const aboutContent = `Our website is born out of a deep-rooted passion for blogging, fueled by an unwavering dedication to deliver an exceptional experience to our cherished readers. Every aspect of our platform has been meticulously crafted, leaving no stone unturned, with the ultimate goal of presenting an extensive range of captivating and thought-provoking content. Our team of devoted individuals has painstakingly curated a collection of articles that inform, engage, and inspire, covering a diverse array of topics that cater to a broad spectrum of interests.\n` +
                      `\n With an unwavering commitment to quality, we handpick each piece of material with care, ensuring that it not only captivates but also educates. Our mission is to enrich the minds of our esteemed readership, encouraging intellectual curiosity and fostering meaningful conversations. Whether you are embarking on a journey through the realm of scientific discoveries or immersing yourself in the depths of art and culture, our platform serves as a wellspring of enlightenment and entertainment.\n` +
                      `\n With an unwavering commitment to quality, we handpick each piece of material with care, ensuring that it not only captivates but also educates. Our mission is to enrich the minds of our esteemed readership, encouraging intellectual curiosity and fostering meaningful conversations. Whether you are embarking on a journey through the realm of scientific discoveries or immersing yourself in the depths of art and culture, our platform serves as a wellspring of enlightenment and entertainment.\n` + 
                      `\n We strive to seamlessly blend knowledge and enjoyment, transcending the boundaries of a traditional blog. By intertwining captivating storytelling with well-researched information, we create an immersive and engaging tapestry of content that captivates your imagination. Join us on this extraordinary adventure as we traverse the vast intellectual landscape, empowering you to explore new ideas, broaden your horizons, and connect with a community of like-minded individuals who share your thirst for knowledge and exploration. Welcome to our world of captivating and enlightening blogging.`;
const contactContent =  `"Connect with me 😁"\n` +
                        `\nEmail: ajeeteshawadh@gmail.com \n` + 
                        `\nLinkedIn: https://www.linkedin.com/in/ajeetesh-awadh-408554230/`;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title: String, 
  content: String
});

const Post = mongoose.model("Post", postSchema);

// let posts = [];

app.get("/", function(req, res){
  
  Post.find().then(posts => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save().then(() => {
    // console.log("Post added to DB");
    res.redirect("/");
  })
  .catch(err =>{
    res.status(400).send("Unable to save post to database");
  });
  

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  const requestedTitle = _.lowerCase(req.params.postName);   

  Post.findById(requestedPostId)
    .then(function(post) {
      res.render('post', {
        title: post.title,
        content: post.content
    })

  });

});

app.post("/delete", function(req, res) {
  const idDelete = req.body.button;

  Post.findByIdAndRemove(idDelete)
    .then(function(idDelete) {
      // console.log("successfully deleted");
      res.redirect("/");
    });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
