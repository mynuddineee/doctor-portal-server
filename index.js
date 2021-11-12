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
                const usersCollection = database.collection('users');

              // to get the appointment data from db for specific users

              app.get('/appointments', async(req, res) => {

                const email = req.query.email;
                const date = req.query.date;
                //console.log(date);
                const query = { email: email, date: date };
                const cursor = appointmentsCollection.find(query);
                const appointments = await cursor.toArray();
                res.json(appointments);
              })

                // to send appointment data to the db
                app.post('/appointments', async(req, res) => {
                    const appointment = req.body;
                    const results = await appointmentsCollection.insertOne(appointment);
                    
                    res.json(results);
                  
                })

                // user data sent to the db

                app.post('/users', async(req, res)=>{

                  const user = req.body;
                  const results = await usersCollection.insertOne(user);
                  console.log(results);
                  res.json(results);

                })

                // google SignIn data sent to the db

                app.put('/users', async(req, res)=>{

                  const user = req.body;
                  const filter = {email: user.email};
                  const options = {upsert: true};
                  const updateDoc = {$set: user};
                  const results = await usersCollection.updateOne(filter, updateDoc, options);
                  res.json(results);

                })
               
                // make an admin give role in the users collection

                app.put('/users/admin', async(req, res)=>{

                  const user = req.body;
                  const filter = {email: user.email}
                  const updateDoc = {$set: {role: 'admin'}};
                  const result = await usersCollection.updateOne(filter, updateDoc);
                  res.json(result);
                })


                // specific user is admin or not checking for this get data from users collection

                app.get('/users/:email', async(req, res)=>{

                  const email = req.params.email;
                  const query = {email: email};
                  const user = await usersCollection.findOne(query);
                  let isAdmin = false;
                  if(user?.role === 'admin'){

                    isAdmin = true;
                  }

                  res.json({admin: isAdmin});
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