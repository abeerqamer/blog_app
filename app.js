var express     = require("express"),
app             = express(),
method_override = require("method-override"),
mongoose        = require("mongoose"),
exress_sanitizer= require("express-sanitizer"), 
body_parser     = require("body-parser");

mongoose.connect("mongodb://localhost/restful_blog_app");


// APP CONFIGURATION
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(body_parser.urlencoded({extended:true}));
app.use(exress_sanitizer())
app.use(method_override("_method"))


var blog_schema = new mongoose.Schema({

	title: String,
	image: String,
	body: String,
	date: {type: Date, default: Date.now}



});





var Blog = mongoose.model("Blog",blog_schema);


// Blog.create({


// 	title: "abeer is good",
// 	image: "https://images.pexels.com/photos/115045/pexels-photo-115045.jpeg?h=350&auto=compress&cs=tinysrgb",
// 	body: "its a lovely and awesome monutian you should go there"

// });

app.get("/",function(req,res){


	res.redirect("/blogs")


});

// index route
app.get("/blogs",function(req,res){

	Blog.find({},function(err,blogs){

		if(err){

			console.log(err);
		}else{

			res.render("index",{blogs:blogs})
		}


	});

	
});


// NEW ROUTE
app.get("/blogs/new",function(req,res){

	res.render("new")


});

//CREATE ROUTE

app.post("/blogs",function(req,res){

	
	req.body.blog.body = req.sanitize(req.body.blog.body)

	
	Blog.create(req.body.blog,function(err,blog){

		if(err){

			res.render("new")

		}else{

			res.redirect("/blogs")

		}

	})



});



// SHOW ROUTE
app.get("/blogs/:id",function(req,res){

	Blog.findById(req.params.id,function(err,blog){

		if(err){

			res.redirect("/blogs")
		}else{

			res.render("show",{blog:blog});
		}



	});


	

});



//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){

	Blog.findById(req.params.id,function(err,blog){

		if(err){

			res.redirect("/blogs")
		}else{

			res.render("edit",{blog:blog})
		}


	});



});

// UPDATE ROUTE
app.put("/blogs/:id",function(req,res){

	req.body.blog.body = req.sanitize(req.body.blog.body)

	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){


		if(err){

			res.redirect("/blogs");

		}else{

			res.redirect("/blogs/" +req.params.id);
			


		}

	});


});


// DELETE ROUTE

app.delete("/blogs/:id",function(req,res){

	Blog.findByIdAndRemove(req.params.id,function(err){

		if(err){

			res.redirect("/blogs")


		}else{

			res.redirect("/blogs")
		}

	});


});








app.listen(27017,function(){


	console.log("Yes I'm alive!!!")


});