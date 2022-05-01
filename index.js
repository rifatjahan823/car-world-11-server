const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 5000
//use middleware
app.use(cors());
app.use(express.json());



const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aqjd3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const inventoryCollection = client.db("carWorld").collection("inventory");

        //get all inventory
        app.get("/inventory",async(req,res)=>{
         const query = {};
         const cursor = inventoryCollection.find(query);
         const inventories = await cursor.toArray();
         res.send(inventories);
  })

        //get one inventory
        
        app.get("/inventory/:Id",async(req,res)=>{
          const Id = req.params.Id
          const query = {_id:ObjectId(Id)};
          const getOneInventory = await inventoryCollection.findOne(query);
          res.send(getOneInventory)
      })



  
    } 
    finally {
    
    }
  }
  run().catch(console.dir);
 




app.get('/', (req, res) => {
    res.send('Hello World!!')
  })
   
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  