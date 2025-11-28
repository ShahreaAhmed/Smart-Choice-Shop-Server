const express = require('express')
const app = express()
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


const uri = process.env.MONGODB_URI;;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("smart-choice-db")
    const productCollection = db.collection("products")

    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray()
      res.send(result)
    })



      app.get("/smart-choice-db/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await productCollection.findOne({ _id: new ObjectId(id) });
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server Error" });
      }
    });


     // Add New 
    app.post("/products", async (req, res) => {
      try {
        const data = req.body;
        const result = await productCollection.insertOne(data);
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server Error" });
      }
    });

  

    // Delete
    app.delete("/products/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const result = await productCollection.deleteOne({ _id: new ObjectId(id) });
        res.send({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server Error" });
      }
    });



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('User server is available.')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
