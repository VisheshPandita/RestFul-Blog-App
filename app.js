var express    = require("express"),
	app        = express(),
	methodOverride = require("method-override"),
	mongoose   = require("mongoose"),
	bodyParser = require("body-parser");

//App config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));


// Mongoose/Model config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("blog", blogSchema);


//Restful routes


//Root Route
app.get("/", function(req, res) {
	res.redirect("/blogs");
});


//Index Route
app.get("/blogs", function(req, res){
	
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		} else{
			res.render("index", {blogs: blogs});
		}
	});
	
});

app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){

	//Create blog
	Blog.create(req.body.blog, function(err, newBlog){
		if (err) {
			res.render("new");
		} else{
			res.redirect("/blogs");
		}
	})

});

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if (err) {
			res.redirect("/blogs");
		}else{
			res.render("show", {blog: foundBlog});
		}
	})
});

//Edit route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.render("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	});
});

//Update route
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
		if (err) {
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//Delete route
app.delete("/blogs/:id", function(req, res){
	//destroy blog
	Blog.findByIdandRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
	//redirect somewhere
});

app.listen(3000, function(){
	console.log("Server for Blog app is started.");
});

