const express = require('express');
const { default: mongoose, Mongoose } = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
// app.get('/',(req,res)=>{
//     res.send("Hlo franklin")
// })

mongoose.connect('mongodb://localhost:27017/TodoList').then(()=>{
    console.log("Connected to MongoDB")
}).catch((error)=>{
    console.log('Problem in MongoDB');
    
})

const todoschema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
    id: Number,
    date: {type: Date, default: Date.now}  // automatically set to current date when document is created.
})

const todomodel = mongoose.model('Todo',todoschema);

app.use(express.json());
let todos = []

app.get('/todo',async(req,res)=>{
    try {
        const todos = await todomodel.find();
        res.json(todos)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Failed to fetch todos'
        })
    }
})
app.post('/todos',async(req,res)=>{

    const {title,description} = req.body;
    if(!title ||description===null){
        return res.status(400).json({error: 'Title and description are required'})
    }
    console.log(title,description);
    
    // const newtodo = {
    //     id: Date.now(),
    //     title,
    //     description,
    //     completed: false
    // }
    try {
        const newtodo = new todomodel({title, description,completed:false})
        await  newtodo.save();
        todos.push(newtodo) 
        res.status(201).json({
            message: 'Todo added successfully',
            todo: newtodo
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Failed to add todo'
        })
    }  
});

app.put('/todos/:id',async (req,res)=>{
    const {id} = req.params;
    const {title,description,completed} = req.body;
    if(!title || !description||!completed){
        return res.status(400).json({
            error: 'Title, description and completed are required'
        })
    }
    try {
        const todo = await todomodel.findByIdAndUpdate(id,
            {$set:{title,description,completed}},
            {new:true}
        );
        if(!todo){
            return res.status(404).json({error: 'Todo not found'})
        }
        res.json({
            message: 'Todo updated successfully',
            todo
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Failed to update todo'
        })
    }
});

app.delete('/todos/:id',async(req,res)=>{
    const {id} = req.params;
    try {
        const todo = await todomodel.findByIdAndDelete(id);
        if(!todo){
            return res.status(404).json({error: 'Todo not found'})
        }
        res.json({
            message: 'Todo deleted successfully',
            todo
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Failed to delete todo'
        })
    }
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});