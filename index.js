const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

//Slugs are the last part of url the string that identify which page is chosen
////////////////////////////////////////////////

//blocking synchronus way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// // without utf-8 file encoding it will throw an error
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

//non blocking asynchronus way, no need of file encoding
/*
fs.readFile('./txt/start.txt','utf-8',(err, data)=>{
    console.log(data);// this will display second
});
console.log('will read file');// this will display first*/

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written 😁');
//       })
//     });
//   });
// });
// console.log('Will read file!');

////////////////////////////////////////////
// we cannot add comments in package.json file
//Servers

// Properties and files to be loaded in start of page
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
//here readFile cannot be used bcoz it expects a call back fuction and we have to use the data futher in program

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

// Creation of server and request handling
const server = http.createServer((req, res) => {
  //console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  //Routing is diffrent urls like /over /prod

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    //if in a arrow function there is no curly braces thenvalue is automatically returned
    //console.log(cardsHtml);
    res.end(output);

    //console.log(res.url);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //console.log(res.url);

    // API
  } else if (pathname === "/api") {
    //console.log(productData);
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
    //res.end('API');

    // Not Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-duniya",
    });
    res.end("<h1>Page not found!!</h1>");
  }
  //res.end('Hello from adele and the server!!');
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on the port 8000");
});
