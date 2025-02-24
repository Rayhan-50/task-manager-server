// const express = require('express');
// const app = express();
// const cors = require('cors');
// require('dotenv').config()
// const port = process.env.PORT || 5000;

// //middleware
// app.use(cors());
// app.use(express.json());


// // const { MongoClient, ServerApiVersion } = require('mongodb');
// // const { ObjectId } = require('mongodb');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxvwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {


//     const userCollection = client.db("task-manager").collection("users");
//     const taskCollection = client.db("task-manager").collection("tasks"); 


    
// app.post('/users', async(req,res)=>{
//     const user =req.body;
//     // insert email if user does not exist
//     const query = {email: user.email}
//     const existingUser = await userCollection.findOne(query);
//     if(existingUser){
//       return res.send({message: 'user already exists', insertedId: null})
//     }
//     const result = await userCollection.insertOne(user);
//     res.send(result);
//   });
  
// // Add task route
// app.post('/tasks', async (req, res) => {
//   const { title, description, category } = req.body;

//   // Basic validation for the title field
//   if (!title || title.trim().length === 0) {
//     return res.status(400).send({ message: "Title is required" });
//   }

//   // Optional validation for the category (it should be one of the allowed values)
//   const validCategories = ['To-Do', 'In Progress', 'Done'];
//   if (!validCategories.includes(category)) {
//     return res.status(400).send({ message: "Invalid category" });
//   }

//   // Construct the task object
//   const task = {
//     title,
//     description: description || "",
//     category: category || 'To-Do', 
//     timestamp: new Date(), 
//   };

//   try {
//     // Insert the task into MongoDB
//     const result = await taskCollection.insertOne(task);

//     // Send back the response
//     res.status(201).send({
//       message: "Task added successfully",
//       insertedId: result.insertedId,
//     });
//   } catch (error) {
//     // Log the error and send a response with status 500 (internal server error)
//     console.error('Error adding task:', error);
//     res.status(500).send({ message: "Error adding task", error: error.message });
//   }
// });


// // Get all tasks route
// app.get('/tasks', async (req, res) => {
//   try {
//       const tasks = await taskCollection.find().toArray();
//       console.log(tasks);  // Log the tasks array to confirm it's an array
//       res.status(200).send(tasks);
//   } catch (error) {
//       console.error('Error fetching tasks:', error);
//       res.status(500).send({ message: "Error fetching tasks", error: error.message });
//   }
// });



// // Update task route
// app.put('/tasks/:id', async (req, res) => {
//   const { id } = req.params;
//   const { title, description, category } = req.body;

//   // Validation
//   if (!title || title.trim().length === 0) {
//     return res.status(400).send({ message: "Title is required" });
//   }

//   const validCategories = ['To-Do', 'In Progress', 'Done'];
//   if (category && !validCategories.includes(category)) {
//     return res.status(400).send({ message: "Invalid category" });
//   }

//   try {
//     // Update the task in MongoDB
//     const result = await taskCollection.updateOne(
//       { _id: new MongoClient.ObjectId(id) },  // Match task by ID
//       { $set: { title, description, category } }  // Update fields
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).send({ message: "Task not found" });
//     }

//     res.status(200).send({ message: "Task updated successfully" });
//   } catch (error) {
//     console.error('Error updating task:', error);
//     res.status(500).send({ message: "Error updating task", error: error.message });
//   }
// });

// // Delete task route
// app.delete('/tasks/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Delete the task from MongoDB
//     const result = await taskCollection.deleteOne({ _id: new MongoClient.ObjectId(id) });

//     if (result.deletedCount === 0) {
//       return res.status(404).send({ message: "Task not found" });
//     }

//     res.status(200).send({ message: "Task deleted successfully" });
//   } catch (error) {
//     console.error('Error deleting task:', error);
//     res.status(500).send({ message: "Error deleting task", error: error.message });
//   }
// });




//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//     res.send('task is sitting')
// })

// app.listen(port, () => {
//     console.log(`task Manager is sitting on port ${port}`)
// })



const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI and Client Setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxvwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create MongoClient instance
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Database and Collection
    const userCollection = client.db("task-manager").collection("users");
    const taskCollection = client.db("task-manager").collection("tasks");

    // User Route
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'User already exists', insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Add Task Route
    app.post('/tasks', async (req, res) => {
      const { title, description, category } = req.body;

      // Basic Validation
      if (!title || title.trim().length === 0) {
        return res.status(400).send({ message: "Title is required" });
      }

      const validCategories = ['To-Do', 'In Progress', 'Done'];
      if (category && !validCategories.includes(category)) {
        return res.status(400).send({ message: "Invalid category" });
      }

      // Task Object Construction
      const task = {
        title,
        description: description || "",
        category: category || 'To-Do',
        timestamp: new Date(),
      };

      try {
        const result = await taskCollection.insertOne(task);
        res.status(201).send({
          message: "Task added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).send({ message: "Error adding task", error: error.message });
      }
    });

    // Get All Tasks Route
    app.get('/tasks', async (req, res) => {
      try {
        const tasks = await taskCollection.find().toArray();
        res.status(200).send(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send({ message: "Error fetching tasks", error: error.message });
      }
    });

    // Update Task Route
    app.put('/tasks/:id', async (req, res) => {
      const { id } = req.params;
      const { title, description, category } = req.body;

      // Validation
      if (!title || title.trim().length === 0) {
        return res.status(400).send({ message: "Title is required" });
      }

      const validCategories = ['To-Do', 'In Progress', 'Done'];
      if (category && !validCategories.includes(category)) {
        return res.status(400).send({ message: "Invalid category" });
      }

      try {
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { title, description, category } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Task not found" });
        }

        res.status(200).send({ message: "Task updated successfully" });
      } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send({ message: "Error updating task", error: error.message });
      }
    });

    // Delete Task Route
    app.delete('/tasks/:id', async (req, res) => {
      const { id } = req.params;

      try {
        const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Task not found" });
        }

        res.status(200).send({ message: "Task deleted successfully" });
      } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send({ message: "Error deleting task", error: error.message });
      }
    });

    // Connect to MongoDB
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (error) {
    console.error('Error running the app:', error);
  }
}

run().catch(console.dir);

// Root Route
app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

// Start Server
app.listen(port, () => {
  console.log(`Task Manager is running on port ${port}`);
});
