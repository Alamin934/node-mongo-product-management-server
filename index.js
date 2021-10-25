const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;



app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('This is my node mongo Product Manage management Server')
});


const uri = "mongodb+srv://alamin934:CCUTImCWwbPzZH98@cluster0.wpmdo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("product_management");
        const productsCollection = database.collection("products");

        //GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        //GET API ID
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            // console.log('get products id', id);
            res.send(result);
        });

        // POST API
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            console.log('got new user', req.body)
            console.log('added new user', result)
            // res.send(JSON.stringify(result));
            res.json(result);
        });
        //UPDTAE API
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedProduct.name,
                    price: updatedProduct.price,
                    quantity: updatedProduct.quantity
                },
            };
            const result = await productsCollection.updateOne(filter, updateDoc, options);
            console.log('updated product', result);
            res.json(result)
        });
        //DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            // console.log('delete signle product', result);
            res.json(result);
        });



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('App listening at', port);
});