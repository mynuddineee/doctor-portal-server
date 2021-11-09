const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfqqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run(){
            try{
                await client.connect();
                console.log('db connection established');
                const database = client.db('doctors_portal');
                const appointmentsCollection = database.collection('appointments');

                app.post('/appointments', async(req, res) => {

                  
                })
               
                

            }

            finally{
                // await client.close();

            }



}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Doctors Portal!')
})

app.listen(port, () => {
  console.log(` listening at http://localhost:${port}`)
})




                //app.get('/users')           all users get using find operations
               // app.post('/users')          only one users send to the db using insert
               // app.delete('/users/:id')    specific only one users deleted
               // app.get('users/:id')        specific only one users find using findOne
               // app.put('/users/:id')       specific only one users data updated