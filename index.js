const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// middleware for posting
app.use(cors());
app.use(express.json());

// user : crudOperation
// pass : 8cMyTFrxxR71xbvS

const uri = "mongodb+srv://crudOperation:8cMyTFrxxR71xbvS@cluster0.zslia.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("crudOperation");
        const productCollection = database.collection("products");
        console.log('mongodb is added');

        // POST method
        app.post('/products', async(req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            console.log('got new product', req.body);
            console.log('got new product', result);
            res.json(result);
        })

        // GET method for all products
        app.get('/products', async(req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        // DELETE METHOD for products
        app.delete('/products/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            console.log('Deleted product id ', result);
            res.json(result);
        })

        // GET single product
        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.findOne(query);
            console.log('loaded product', id);
            res.send(result);
        })

        // PUT Update product
        app.put('/products/:id', async(req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = {_id:ObjectId(id)};
            const options = { upsert:true };
            const updateDoc = {
                $set: {
                    name: updatedProduct.name,
                    description: updatedProduct.description,
                    price: updatedProduct.price,
                    img: updatedProduct.img
                },
            };
            const result = await productCollection.updateOne(filter,updateDoc, options);
            console.log('updating service', id);
            console.log('got update product', req.body);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!');
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })