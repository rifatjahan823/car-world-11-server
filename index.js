const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 5000
//use middleware
app.use(cors());
app.use(express.json());

//carWorld
//hA0zc7zXWFC1iAhD


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqjd3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const inventoryCollection = client.db("carWorld").collection("inventory");
      // create a document to insert
     app.post('/user',(req,res)=>{
 
   })
      const result = await userCollection.insertOne(user);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
 




app.get('/', (req, res) => {
    res.send('Hello World!!')
  })
   
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  