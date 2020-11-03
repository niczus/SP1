var path = require("path");
var parser = require("body-parser");
var express = require("express");
var fs = require("fs");


var app = express();


app.use(parser.json());
app.use(parser.urlencoded({ extended: false}));

var mysql = require("mysql");

app.use(express.static('./public'));



var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "seed_one"
  });

connection.connect(function(err) {
    if (err) {
      console.error("error connecting: " + err.stack);
      return;
    }  
    console.log("connected as id " + connection.threadId);
  });


app.get("/", function(req, res) {
    fs.readFile("/public/index.html", "UTF-8", function (err, html) {
        if (err) throw err;      
    res.end(html);    
  }) 
})

app.get("/update", function(req, res) {
    fs.readFile("./public/update.html", "UTF-8", function (err, html) {
        if (err) throw err; 
    res.end(html);    
  })
})


app.get("/:name", function (req, res) {
    var custName = (req.params.name);
})



//send info to the database

app.post("/", function(req, res) {
    var user = req.body;
    let id = "";

 
    let q = connection.query("INSERT INTO orders SET ?",
    {
        cust_id: null,
        name: user.name,
        telephone: user.phone,
        email: user.email,
        address_id: user.address,
        date_ordered: user.date_ordered,        
        delivery_date: user.delivery_date,
        cucumber: user.cucumber,
        tomato: user.tomato,
        squash: user.squash,
        jalapeno: user.jalapeno,
        avacados: user.avacados,
        greenpepper: user.greenpepper,
        greenbeans: user.greenbeans,
        asparagus: user.asparagus        
        })
    
        connection.query (`SELECT cust_id from orders order by cust_id desc`, function(err, result){
            for (let i = 0; i <result.length; i+= result.length){
                id+= '<h2 class="thanks">' + result[i].cust_id + '</h2>';
            }

        res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Seed One Project</title>
                    <link rel="stylesheet" href="https://static.tlmworks.org/track_1.0/cdns/bootstrap-4/css/bootstrap-4.1.3.min.css">
                    <link rel="stylesheet" href="sOne.css">
                </head>
                <body>
                    <header class = "jumbotron jumbotron-fluid" style="background-image: url('images/header.jpg')">
                    <section id="fade">
                        <h1>PIONEER</h1>
                        <h2>harvest wagon</h2>
                        <p class="lead">Fresh seasonal produce delivered to you</p>
                    </section>
                    </header>
                            <p class="thanks"> Thank you for your order, ${user.name}.</p>
                            <p class="thanks"> Your order ID is: </p>
                            ${id}
                           
                            <p class="order">To see a copy of your order enter your name then click "view order"</p>

                            <form id="view" method="POST" action="/view" >
                            <label for="name2">Name</label>
                            <input id="name2" name="name2" required><br>
                            <button id="view" class="view" type="submit">View Order</button>
                            </form>
                             
                            <script src="https://static.tlmworks.org/track_1.0/cdns/bootstrap-4/js/bootstrap.min.js">            
                </body>
            </html>`)
    }) 
}) 
    
// Customer can see their order

app.post('/view', function(req, res) {      
    let user = req.body;     
    
    let q = connection.query(`SELECT * from orders where name = ? order by name desc limit 1`, [user.name2], function (err, result) {
      if (err) throw err;    
      
      let html = '<body class="viewOrder">';
            html += "<link rel='stylesheet' href='sOne.css' type='text/css'>";
           
            html += `<h2 class="seeOrder">${result[0].name}, here is a copy of your order:</h2>`;                      
                    
                    html += "<ul>"
                    html += "<h3> delivery-date: " + result[0].delivery_date + "<h3>";
                    html += "<h4> cucumbers: "+ result[0].cucumber + "</h4>";
                    html += "<h4> tomatoes: "+ result[0].tomato + "</h4>";
                    html += "<h4> squash: "+ result[0].squash + "</h4>";
                    html += "<h4> avacados: "+ result[0].avacados + "</h4>";
                    html += "<h4> green peppers: "+ result[0].greenpepper + "</h4>";
                    html += "<h4> green beans: "+ result[0].greenbeans + "</h4>";
                    html += "<h4> asparagus: "+ result[0].asparagus + "</h4>";
                    html += "</ul>"; 
                
                html+= '<form id="home" method="GET" action="/">';                     
                html+= '<button id="home" class="home" type="submit">Home</button>';
                html+= '</form>'; 

                html+= '<form id="update" method="GET" action="/update">';             
                html+= '<button id="update" class="update" type="submit">Change Order</button>';
                html+= '</form>'; 
                html+= '</body>'       
    res.send(html);
  
        });      
   });

  
    
// Customer has updated their order

   app.post("/update", function(req, res) {
    var user = req.body;
    var id = user.id;
    connection.query(`Update orders SET ? where cust_id = ${id}`,
    {
        
        delivery_date: user.delivery_date,
        cucumber: user.cucumber,
        tomato: user.tomato,
        squash: user.squash,
        jalapeno: user.jalapeno,
        avacados: user.avacados,
        greenpepper: user.greenpepper,
        greenbeans: user.greenbeans,
        asparagus: user.asparagus    
    })  

        res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Seed One Project</title>
                    <link rel="stylesheet" href="https://static.tlmworks.org/track_1.0/cdns/bootstrap-4/css/bootstrap-4.1.3.min.css">
                    <link rel="stylesheet" href="sOne.css">
                </head>
                <body>
                    <header class = "jumbotron jumbotron-fluid" style="background-image: url('images/header.jpg')">
                    <section id="fade">
                        <h1>PIONEER</h1>
                        <h2>harvest wagon</h2>
                        <p class="lead">Fresh seasonal produce delivered to you</p>
                    </section>
                    </header>
                            <p class="thanks"> We have changed your order.</p>
                           
                            <p class="order">To see a copy of your updated order enter your name then click "view order"</p>

                            <form id="view" method="POST" action="/view2" >
                            <label for="name2">Name</label>
                            <input id="name2" name="name2" required><br>
                            <button id="view2" class="view2" type="submit">View Order</button>
                            </form>
                             
                            <script src="https://static.tlmworks.org/track_1.0/cdns/bootstrap-4/js/bootstrap.min.js">            
                </body>
            </html>`)


});

//Customer can see changed order

app.post('/view2', function(req, res) {      
    let user = req.body;     
    
    let q = connection.query(`SELECT * from orders where name = ? order by name desc limit 1`, [user.name2], function (err, result) {
      if (err) throw err;    
      
      let html = '<body class="viewOrder">';
            html += "<link rel='stylesheet' href='sOne.css' type='text/css'>";
           
            html += `<h2 class="seeOrder">${result[0].name}, here is a copy of your order:</h2>`;                      
                    
                    html += "<ul>"
                    html += "<h3> delivery-date: " + result[0].delivery_date + "<h3>";
                    html += "<h4> cucumbers: "+ result[0].cucumber + "</h4>";
                    html += "<h4> tomatoes: "+ result[0].tomato + "</h4>";
                    html += "<h4> squash: "+ result[0].squash + "</h4>";
                    html += "<h4> avacados: "+ result[0].avacados + "</h4>";
                    html += "<h4> green peppers: "+ result[0].greenpepper + "</h4>";
                    html += "<h4> green beans: "+ result[0].greenbeans + "</h4>";
                    html += "<h4> asparagus: "+ result[0].asparagus + "</h4>";
                    html += "</ul>"; 
                
                html+= '<form id="home" method="GET" action="/">';                     
                html+= '<button id="home" class="home" type="submit">Home</button>';
                html+= '</form>'; 

                html+= '<form id="update" method="GET" action="/update">';             
                html+= '<button id="update" class="update" type="submit">Change Order</button>';
                html+= '</form>'; 
                html+= '</body>'       
    res.send(html);
  
        });
      
   });
    

 //Employees looking at customer orders

app.post('/signIn', function(req, res) {
    let user = req.body;
    let signIn = user.signIn;
    if (signIn === "1234"){
    connection.query("SELECT * FROM orders order by delivery_date desc", function (err, result){        
        if (err) throw err;        
        var html = "<h1 style='border-bottom: 2px solid black'> Orders from customers</h1>";
       
        html += "<ul>"
        for (var i=0; i< result.length; i++) {
        
            html += "<h3> Name: "+ result[i].name + "</h3>";
            html += "<h4> Phone: "+ result[i].telephone + "</h4>";
            html += "<h4> Address: "+ result[i].address_id + "<h4>";
            html += "<h4> date ordered: "+ result[i].date_ordered + "<h4>"
            html += "<h4> delivery date: "+ result[i].delivery_date + "<h4>"
            html += "<h5> Email: "+ result[i].email + "</h5>";
            html += "<h5> cucumbers: "+ result[i].cucumber + "</h5>";
            html += "<h5> tomatoes: "+ result[i].tomato + "</h5>";
            html += "<h5> squash: "+ result[i].squash + "</h5>";
            html += "<h5> avacados: "+ result[i].avacados + "</h5>";
            html += "<h5> green peppers: "+ result[i].greenpepper + "</h5>";
            html += "<h5> green beans: "+ result[i].greenbeans + "</h5>";
            html += "<h5> asparagus: "+ result[i].asparagus + "</h5>";
            html += "<hr>";
            }
        html += "</ul>";
        
        res.send(html);
    
    });
}
})

app.post  


//404 not available

app.use(function(req, res, next) {
    res.statusCode = 404;
    res.end(`
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Seed One Project</title>
            <link rel="stylesheet" href="https://static.tlmworks.org/track_1.0/cdns/bootstrap-4/css/bootstrap-4.1.3.min.css">
            <link rel="stylesheet" href="sOne.css">
        </head>
        <body>
            <h1 style="text-align: center; margin-top: 150px;">404!</h1>
            <h2 style="text-align: center; margin-top: 50px;"> Page not Available </h2>
        </body>
    </html>`);
    next();
});

app.listen(8000);

console.log("Express app running on port 8000");
module.exports = app;