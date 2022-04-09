const path = require('path');
const fs=require("fs")
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
var { graphqlHTTP } = require('express-graphql')
const graphSchema=require("./graphql/schema")
const graphqlResolver=require("./graphql/resolver")
const cors=require("cors")
const auth=require("./middleware/auth")
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.put((req,res,next)=>{
    if(!req.isAuth){
      throw new Error("")
    }
    if(!req.file){
      res.status(200).json({message:"file not uploaded"})
    }
    if(req.body.oldPath){
      clearImage(req.body.oldPath)
    }
    res.status(201).json({message:"file uploaded",filePath:req.file.path})
})
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(auth)
app.use(cors()) 
app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use("/graphql",graphqlHTTP({
  schema:graphSchema,
  rootValue:graphqlResolver,
  graphiql: true,
  customFormatErrorFn(err){
    if(!err.originalError){
        return err
    }
    const data=err.originalError.data 
    const code=err.originalError.code || 500;
    const message=err.message || "an error occur";
    return {message:message,status:code, data:data}
  }
}))
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://mongoose:john123@cluster0.xcjno.mongodb.net/microservice',{
         useNewUrlParser: true,
         useUnifiedTopology: true 
  }
  ) 
  .then(con=>{
    console.log("connected to the database")
  })
  .then(result => {
    app.listen(8080,()=>{
      console.log("port running on localhost 3000")
    });
  })
  .catch(err => {
    console.log(err);
});


const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
