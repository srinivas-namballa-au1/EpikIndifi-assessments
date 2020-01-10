const express = require('express');
const bodyParser = require("body-parser");
const mongoClient = require('mongodb').MongoClient;
const pdf = require('html-pdf');
const timestamp = require('unix-timestamp');
// const pdfreader = require("pdfreader");
// const pdfparse = require('pdf-parse');
// const pdfMakePrinter = require('pdfmake/src/printer');
// const PDFDocument = require('pdfkit');
timestamp.round = true;
// const moment = require('moment');
const fs = require('fs');
// moment().format();
// const uuidv4 = require('uuid/v4');

const url = "mongodb://localhost:27017/assessment";

mongoClient.connect(url, (err, db) => {
    if (err) console.log(err);
    console.log("Database created!");
    app.locals.DB = db.db("assessment");
});

const app = express();

//for JSON
app.use(bodyParser.json());

//for HTML
app.use(bodyParser.text({ type: 'text/html' }))

app.use(bodyParser.urlencoded({ 
    extended: true 
 }));

app.get('/', (req, res) => {
    res.send('open postman and insert the data into saveAccountDetails route');
    console.log('array data: ', app.locals.arrData);
});

app.get('/isDeleted', (req, res) => {
    let DB = req.app.locals.DB;

    DB.collection("accountMaster").find({}).toArray((err, docs) => {
        if(err) res.send("Error fetching data");
        
        for(let i = 0; i < docs.length; i++) {
            if(docs[i].isDeleted !== 'y')
            console.log(`fetched docs are: `, docs[i]);
            // app.locals.arrData[i] = docs[i]; 
        }
        res.send("Data fetched");
    })
});

app.post('/saveAccountDetails',(req, res) => {
    // console.log(req.body, "req.bodyreq.body");
    let DB = req.app.locals.DB;

    let accNo = req.body.accNo;
    let cusId = req.body.cusId;
    let firstName = req.body.firstName;
    let middleName = req.body.middleName;
    let lastName = req.body.lastName;
    // console.log(accNo.concat(uuidv4()));
    let custData = {
        // accNo: accNo.concat(uuidv4()),
        accNo: accNo,
        cusId: cusId,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        isDeleted: null,
        createdAt: Date(),
        createdBy: "Srinivas Namballa",
        updatedAt: null,
        updatedBy: null,
        deletedAt: null,
        deletedBy: null
    }

    //method 1
    // DB.collection("accountMaster").find({}).toArray((err, docs) => {
    //     if(err) res.send("Error fetching data");
    //     //method 1
    //     for(let i = 0; i < docs.length; i++) {
    //         if(docs[i].accNo === accNo) {
    //             res.send("Account number already exists!");
    //             break;
    //         } else if(i === docs.length-1){
    //             DB.collection("accountMaster").insertOne(custData, (err, result) => {
    //                 if(err){
    //                     return res.send("Error occured while inserting data to DB");
    //                 }
            
    //                 res.send(`1 document inserted: ${{result}}`);
    //             })
    //         }
    //     }
    // })

    //method 2
            // use uuidv4 to generate random account No.

        // res.send("Data fetched");

    //method 3
    // DB.collection("accountMaster").findOne(({accNo: accNo}),(err, docs) => {
    //     if(err) res.send("Error fetching data");
    //     // console.log('docs fetched r', docs.accNo);
    //     if(docs.accNo === accNo) {
    //         return res.send("Account Number already exists!");
    //     }

    //     DB.collection("accountMaster").insertOne(custData, (err, result) => {
    //         if(err){
    //             return res.send("Error occured while inserting data to DB");
    //         }
    
    //         res.send(`1 document inserted: ${{result}}`);
    //     })
    // });

    //method 4 using Indexes
    if(DB.collection("accountMaster").createIndex({"accNo":1},{unique: true})) {
        DB.collection("accountMaster").insertOne(custData, (err, result) => {
            if(err){
                return res.send("Error occured while inserting data to DB");
            }
    
            res.send(`1 document inserted: ${{result}}`);
        })
    }
    
});

// app.put('/updateAccountDetails', (req, res) => {
    
//     let DB = req.app.locals.DB;

//     let accNo = req.body.accNo;
//     // let firstName = req.body.firstName;
//     // let middleName = req.body.middleName;
//     // let lastName = req.body.lastName;
//     let updateValues = [];

//     let arr = ["firstName", "middleName", "lastName"];

//     // let arr1 = [];

//     // console.log(arr[0]);

//     for(let i = 0; i < arr.length; i++) {
//         // console.log('req body: ', req.body.arr[i]);
//         // console.log([arr[i]]);
//         // console.log({[arr[i]]: req.body.arr[i]});

//         console.log(arr[i])

//         if(req.body[arr[i]]) {
//             // arr1.push(req.body[arr[i]]);
//             // updateValues = {
//             //     $set: {
//             //         [arr[i]]: req.body[arr[i]]
//             //     }

//             //     // [arr[i]]: req.body.arr[i]
//             // }
//             // console.log({[arr[i]]: req.body.arr[i]});

//             updateValues = {
//                 $set: {
//                     [arr[i]]: req.body[arr[i]]
//                 }
                
    
//                 // [arr[i]]: req.body.arr[i]
//             }
//             console.log('updated values: ', updateValues)
//             console.log('update ', arr[0])
//             console.log('Printing array', arr[i])
//             console.log(req.body[arr[i]]);
//         }

//        DB.collection("accountMaster").updateOne({accNo: accNo}, updateValues, (err) => {
//             if(err) return res.send("Error occured while updating the account details");
    
//             // console.log("updated result: ", result);
    
//         });
//         // updateValues = {
//         //     $set: {
//         //         [arr[i]]: arr1[i]
//         //     }

//         //     // [arr[i]]: req.body.arr[i]
//         // }
//     }

//     res.send(`Account details of ${accNo} updated`);


//     // console.log('firstName', firstName);
//     // console.log('middleName', middleName);
//     // console.log('lastName', lastName);

//     // if(firstName === undefined && middleName === undefined && middleName === undefined) {
//     //     return res.send("Enter the first name, middle name and last name to be updated");
//     // } else if(firstName === undefined) {
//     //     updateValues = { $set: {middleName: middleName, lastName: lastName } };
//     // } else if(middleName === undefined) {
//     //     updateValues = { $set: {firstName: firstName, lastName: lastName } };
//     // } else if(lastName === undefined) {
//     //     updateValues = { $set: {firstName: firstName, middleName: middleName } };
//     // } else {
//     //     updateValues = { $set: {firstName: firstName, middleName: middleName, lastName: lastName } };
//     // }

// });

app.put('/updateAccountDetails', (req, res) => {
    
    let DB = req.app.locals.DB;

    let accNo = req.body.accNo;
    // let firstName = req.body.firstName;
    // let middleName = req.body.middleName;
    // let lastName = req.body.lastName;
    // let updateValues = [];

    let arr = ["firstName", "middleName", "lastName"];

    // let arr1 = [];

    // console.log(arr[0]);

    let obj = {};

    for(let i = 0; i < arr.length; i++) {
        // console.log('req body: ', req.body.arr[i]);
        // console.log([arr[i]]);
        // console.log({[arr[i]]: req.body.arr[i]});

        console.log(arr[i])

        if(req.body[arr[i]]) {
            // arr1.push(req.body[arr[i]]);
            // updateValues = {
            //     $set: {
            //         [arr[i]]: req.body[arr[i]]
            //     }

            //     // [arr[i]]: req.body.arr[i]
            // }
            // console.log({[arr[i]]: req.body.arr[i]});

            // updateValues = {
            //     $set: {
            //         [arr[i]]: req.body[arr[i]]
            //     }
                
    
            //     // [arr[i]]: req.body.arr[i]
            // }

            obj[arr[i]] = req.body[arr[i]]
            // {
            //     [arr[i]]: req.body[arr[i]]
            // }
            // console.log('updated values: ', updateValues)
            // console.log('update ', arr[0])
            // console.log('Printing array', arr[i])
            // console.log(req.body[arr[i]]);
            console.log(obj)
        }
    }
    // console.log(obj)
    let updateValues = {
        $set: obj

        // [arr[i]]: req.body.arr[i]
    }

    console.log(updateValues);

    DB.collection("accountMaster").updateOne({accNo: accNo}, updateValues, (err) => {
        if(err) return res.send("Error occured while updating the account details");

        // console.log("updated result: ", result);
        res.send(`Account details of ${accNo} updated`);
    });

    // console.log('firstName', firstName);
    // console.log('middleName', middleName);
    // console.log('lastName', lastName);

    // if(firstName === undefined && middleName === undefined && middleName === undefined) {
    //     return res.send("Enter the first name, middle name and last name to be updated");
    // } else if(firstName === undefined) {
    //     updateValues = { $set: {middleName: middleName, lastName: lastName } };
    // } else if(middleName === undefined) {
    //     updateValues = { $set: {firstName: firstName, lastName: lastName } };
    // } else if(lastName === undefined) {
    //     updateValues = { $set: {firstName: firstName, middleName: middleName } };
    // } else {
    //     updateValues = { $set: {firstName: firstName, middleName: middleName, lastName: lastName } };
    // }

});

app.delete('/deleteAccountDetails', (req, res) => {
    let DB = req.app.locals.DB;

    let accNo = req.body.accNo;
    let isDeleted = 'y';
    let deletedAt = Date();
    let deletedBy = "Srinivas Namballa";

    let updateValues = { $set: {isDeleted: isDeleted, deletedAt: deletedAt, deletedBy: deletedBy } };

    DB.collection("accountMaster").updateOne({accNo: accNo}, updateValues, (err) => {
        if(err) return res.send("Error occured while deleting the account details");

        // console.log("deleted result: ", result);

        res.send(`Account details of ${accNo} deleted`);
    });
});

// JSON to CSV
app.post('/jsontocsv', (req, res) => {
    let DB = req.app.locals.DB;

    let accNo = req.body.accNo;
    let cusId = req.body.cusId;
    let firstName = req.body.firstName;
    let middleName = req.body.middleName;
    let lastName = req.body.lastName;
    let branchName = req.body.branchName;
    let ifscCode = req.body.ifscCode;

    let custData = {
        accNo: accNo,
        cusId: cusId,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        branch: branchName,
        ifscCode: ifscCode
    }

    let alphaNumeric = /^[0-9a-zA-Z]+$/;
    let alphabets = /^[a-zA-Z]+$/;

    if(accNo === null || accNo === '') {
        return res.send("Account Number can't be empty");
    } else if(!accNo.match(alphaNumeric)) {
        return res.send("Account Number should contain only alphanumeric value");
    }

    if(cusId === null || cusId === '') {
        return res.send("Customer Id can't be empty");
    } else if(isNaN(cusId)) {
        return res.send("Customer Id should contain only numeric value");
    }

    if(firstName === null || firstName === '') {
        return res.send("first name can't be empty");
    } else if(!firstName.match(alphabets)) {
        return res.send("first name should contain only alphabets");
    }

    if(middleName === '') {
        console.log("Middle name is empty");
    } else if(middleName === null) {
        return res.send("middle name can't be null");
    } else if(!middleName.match(alphabets)) {
        return res.send("middle name should contain only alphabets");
    }

    if(lastName === null || lastName === '') {
        return res.send("last name can't be empty");
    } else if(!lastName.match(alphabets)) {
        return res.send("last name should contain only alphabets");
    }

    if(branchName === null || branchName === '') {
        return res.send("branch name can't be empty");
    } else if(!branchName.match(alphabets)) {
        return res.send("branch name should contain only alphabets");
    }

    if(ifscCode === null || ifscCode === '') {
        return res.send("ifsc code can't be empty");
    } else if(!ifscCode.match(alphaNumeric)) {
        return res.send("ifsc code should contain only alphanumeric value");
    }

    DB.collection("customers").insertOne(custData, (err, result) => {
        if(err) {
            return res.send("Error occured while inserting data to DB");
        }
        // console.log(custData);
        console.log(JSON.stringify(result.ops[0]));
        res.send(`1 document inserted \n status: success \n Data: ${JSON.stringify(result.ops[0])}`);

        // app.get('/jsontocsv', (req, res) => {
        //     DB.collection("customers").findOne({accNo: accNo}, (err, cust) => {
        //         if(err) {
        //             return res.send("Error occured while fetching the data from the DB");
        //         }
    
        //         console.log(cust);
        //         // res.send(cust);

        //         function ConvertToCSV(objArray) {
        //             var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        //             var str = '';
        
        //             for (var i = 0; i < array.length; i++) {
        //                 var line = '';
        //                 for (var index in array[i]) {
        //                     if (line != '') line += ','
        
        //                     line += array[i][index];
        //                 }
        
        //                 str += line + '\r\n';
        //             }
        
        //             return str;
        //         }
        //         console.log(typeof cust);

        //         // Convert Object to JSON
        //         var jsonObject = JSON.stringify(cust);
        //         console.log('csv', ConvertToCSV(jsonObject));
        //         res.send(ConvertToCSV(jsonObject));
        //     });
        // });
    })
});

app.get('/jsontocsv', (req, res) => {
    let DB = req.app.locals.DB;

    DB.collection("customers").find({}).toArray((err, cust) => {
        if(err) {
            return res.send("Error occured while fetching the data from the DB");
        }

        // console.log(cust);
        // res.send(cust);

        ConvertToCSV = objArray => {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var csv = '';

            for (let i = 0; i < array.length; i++) {
                let line = '';
                for (let index in array[i]) {
                    // console.log("index: ", index);
                    // console.log("array[i]: ", array[i]);
                    if (line != '') line += ','

                    line += array[i][index];
                    console.log(line);
                }

                csv += line + '\r\n';
                // console.log("csv inside function", csv);
            }
            // console.log("csv outside function", csv)
            // return csv;
            // window.open("data:text/csv;charset=utf-8," + escape(csv));

            res.setHeader('Content-disposition', 'attachment; filename=customers.csv');
            res.set('Content-Type', 'text/csv');
            res.status(200).send(csv);

            // res.download(filePath, fileName);
        }
        // console.log(typeof cust);

        // Convert Object to JSON
        // let jsonObject = JSON.stringify(cust);
        // console.log(cust);
        console.log('csv', ConvertToCSV(cust));
        // res.send(ConvertToCSV(cust));
    });
});

app.post('/htmltopdf', (req, res) => {
    let content = req.body;

    // console.log("req: ", req);
    // console.log("res: ", res);
    // console.log("response params: ", req.params);
    //console.log("response body", res.body);
    // console.log(content,"content content");

    // app.locals.html = content;

    let html = "demo_"+timestamp.now()

    pdf.create(content).toFile(`./${html}.pdf`, (err, response) => {
        if (err) return res.send("Error occured while creating the file!");
        console.log(response); // { filename: '/app/businesscard.pdf' }
        
        app.locals.fileName = html;
        console.log("POST FILE NAME: ", app.locals.fileName);

        console.log("PDF CONVERTOR CONTENT: ", content);
        // res.setHeader('Content-Disposition', `attachment; filename=html ${html}.pdf`);
        // res.set('Content-Type', 'application/pdf');
        // res.status(200).send(content);
    });

    res.status(200).send(html);
    // res.done(content);
});

app.get('/htmltopdf', (req, res) => {
    let fileName = req.app.locals.fileName;
    // res.send(content);
    // console.log("PDF CONTENT: ", content);
    console.log('FILE NAME: ', fileName);
    // fs.open(`${fileName}.pdf`, 'r', (err, fd) => {
    //     if (err) {
    //       if (err.code === 'ENOENT') {
    //         console.error('myfile does not exist');
    //         return;
    //       }
      
    //       throw err;
    //     }
      
    //     let data = fd;

    //     console.log("FETCHED FILE DATA: ", data);

    //     // res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
    //     // res.set('Content-Type', 'application/pdf');
    //     // res.sendStatus(200).send(data);
    // });

    // fs.readFile(`./${fileName}.pdf`, 'utf-8', (err, data) => { 
    //     if (err) throw err; 
      
    //     console.log(data);

    //     new PdfReader().parseBuffer(pdfBuffer, function(err, item) {
    //         if (err) callback(err);
    //         else if (!item) callback();
    //         else if (item.text) console.log(item.text);
    //     });

    //     res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
    //     res.set('Content-Type', 'application/pdf');
    //     res.sendStatus(200).send(data);
    // }); 

    // fs.readFile(`./${fileName}.pdf`, (err, pdfBuffer) => {
    //     // pdfBuffer contains the file content
    //     new pdfreader.PdfReader().parseBuffer(pdfBuffer, function(err, item) {
    //       if (err) return res.send(err);
    //       else if (!item) {
    //           console.log("ITEMS NOT PRESENT!");
    //         // res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
    //         // res.set('Content-Type', 'application/pdf');
    //         // res.sendStatus(200).send(items);
    //         // res.send("Hello world text sending");
    //       } 
          
    //       else if (item.text) {
    //         console.log("Item Text", item.text);
    //       }
    //     });
    // });
    // console.log("ITEMS: ", items);
    // res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
    // res.set('Content-Type', 'application/pdf');
    // res.sendStatus(200).send(items);

    // let dataBuffer = fs.readFileSync(`./${fileName}.pdf`);
 
    // pdfparse(dataBuffer).then(function(data) {
    
    //     // number of pages
    //     // console.log(data.numpages);
    //     // // number of rendered pages
    //     // console.log(data.numrender);
    //     // PDF info
    //     // console.log("DATA INFO: ", data.info);
    //     // // PDF metadata
    //     // console.log(data.metadata); 
    //     // // PDF.js version
    //     // // check https://mozilla.github.io/pdf.js/getting_started/
    //     // console.log(data.version);
    //     // // PDF text
    //     console.log("DATA TEXT", data.text);

    //     console.log("DATA TEXT TYPE: ", typeof data.text);

    //     // res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
    //     // res.set('Content-Type', 'application/pdf');
    //     // res.send(data.text);
    //     // res.end();
    // });

    // console.log('PDF LENGTH', content.length);
    // res.setHeader('Content-Length', content.length);
    // res.setHeader('Content-Disposition', 'attachment; filename=html.pdf');
    // res.set('Content-Type', 'application/pdf');
    // res.status(200).send(content);
    // console.log("JSON.stringify(content)", JSON.stringify(content));
    // console.log("JSON.parse(content)", JSON.parse(content));
    // res.send(JSON.stringify(content));

    // var options = { format: 'Letter' };
    
    // let html = moment().format('ddd MMM DD YYYY hh:mm:ss');

    // console.log(moment().format('ddd MMM DD YYYY hh:mm:ss'));

    // pdf.create(content).toFile(`./html ${html}.pdf`, (err, response) => {
    //     if (err) return console.log(err);
    //     console.log(response); // { filename: '/app/businesscard.pdf' }
        
    //     console.log("PDF CONVERTOR CONTENT: ", content);
    //     res.setHeader('Content-Disposition', `attachment; filename=html ${html}.pdf`);
    //     res.set('Content-Type', 'application/pdf');
    //     res.status(200).send(content);
    // });

    // pdf.create(content, options, (err, buffer) => {
    //     if(err) return res.send(err);

    //     console.log("BUFFER: ", buffer);

    //     res.setHeader('Content-Disposition', 'attachment; filename=html.pdf');
    //     res.set('Content-Type', 'application/pdf');
    //     res.status(200).send(buffer);
    // });


    fs.readFile(`${fileName}.pdf` , (err,data) => {
        if(err) console.log(err);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
        res.contentType('application/pdf');
        res.send(data);
    });

});

app.get('/htmltopdf/:fileName', (req, res) => {
    let fileName = req.params.fileName;

    fs.readFile(`${fileName}.pdf` , (err,data) => {
        if(err) console.log(err);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
        res.contentType('application/pdf');
        res.send(data);
    });
});

app.listen(8080, () => {
    console.log('app listening on port 8080!');
});
 