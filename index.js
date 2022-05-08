const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

        //Auth
        app.post("/login",async(req,res)=>{
          const email = req.body;
          const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
          res.send({ accessToken })

        })


        // verifytoken for user

        function verifyToken(req,res,next){
          const tokenVerify = req.headers.authorization;
          if (!tokenVerify ) {
              return res.status(401).send({ message: 'unauthorized access' });
          }
          const token = tokenVerify.split(' ')[1];
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
              if (err) {
                  return res.status(403).send({ message: 'Forbidden access' });
              }
              console.log('decoded', decoded);
              req.decoded = decoded;
              next();
          })
        }

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

   //update quantity

   app.put('/inventoryUpdate/:Id',async(req,res)=>{
    const Id = req.params.Id;
    const updateUser= req.body.quantity;
    const updateSold= req.body.sold;
    const filter = {_id:ObjectId(Id)};
    const options = { upsert: true };
    const updateDoc = {
      $set: {
       quantity:updateUser,
       sold:updateSold
       
      },
    };
    const result = await inventoryCollection.updateOne(filter, updateDoc, options);
    res.send(result)
  })
  ///restock quantity
   app.put('/restock/:Id',async(req,res)=>{
    const Id = req.params.Id;
    const updateUser= parseInt(req.body.quantity);
    const getQuantity= parseInt(req.body.getQuantity);
    const sumQuantity = updateUser+getQuantity;
    const filter = {_id:ObjectId(Id)};
    const options = { upsert: true };
    const updateDoc = {
      $set: {
       quantity:sumQuantity
       
      },
    };
    const result = await inventoryCollection.updateOne(filter, updateDoc, options);
    res.send(result)
  })

 //post and add new inventory
 app.post("/inventoryPost",async(req,res)=>{
  const inventory = req.body;
  const getInventory = await inventoryCollection.insertOne(inventory);
  res.send(getInventory)
})
//
app.post("/inventorys",async(req,res)=>{
  const addOrder = req.body;
  const result = await inventoryCollection.insertOne(addOrder);
  res.send(result)
})
//get my inventory
app.get("/inventorys",verifyToken,async(req,res)=>{
  const decodedEmail = req.decoded.email;
  const email = req.query.email;
  if (email === decodedEmail) {
  const query = {email:email};
  const cursor = inventoryCollection.find(query);
  const inventory = await cursor.toArray();
  res.send(inventory)
}else{
  res.status(403).send({message: 'forbidden access'})
}
})
   //delete
   app.delete("/inventoryDelete/:Id",async(req,res)=>{
    const Id = req.params.Id
    const query = {_id:ObjectId(Id)};
    const result = await inventoryCollection.deleteOne(query);
    res.send(result)
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
  