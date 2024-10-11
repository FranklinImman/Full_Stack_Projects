import React, { useEffect, useState } from 'react'

const Todos = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [edit,setEdit] = useState(-1);
    const [editTitle,seteditTitle] = useState("");
    const [editDescription,seteditDescription] = useState("");

    const api = 'http://localhost:3000/';
    
    const handleSubmit = () => {
        setError("");
        try {
            if (title.trim() !== '' && description.trim() !== '') {
                fetch(api + 'todos', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, description })
                }).then((res) => {
                    if (res.ok) {
                        setTodos([...todos, { title, description }]); // Fix the spread syntax
                        setMessage("Item Added Successfully");
                        setTitle(""); // Clear input after adding
                        setDescription(""); // Clear input after adding
                        setTimeout(() => {
                            setMessage("");
                        }, 3000);
                    } else {
                        setError("Unable to create item");
                    }
                })
            } else {
                setError("Title and description are required");
                setTimeout(() => {
                    setError("");
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            setError("Failed to create item");
        }
    }
    const getItems = ()=>{
        fetch(api + 'todo')
       .then(res=>res.json()).then(res=>{
        setTodos(res);
       })
    }

    useEffect(()=>{
        getItems();
    },[])

    return (
        <>
            <div className='row p-3 bg-success text-light'>
                <h2> Todos App with MERN Stack</h2>
            </div>
            <div className='row'>
                <h3>Add Item</h3>
                {message && <p className='text-success'>{message}</p>}
                <div className='form-group d-flex gap-2'>
                    <input
                        type='text'
                        className='form-control form-control-md '
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                        placeholder='Enter Todo'
                    />
                    <input
                        className='form-control'
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        type='text'
                        placeholder='Enter description'
                    />
                    <button className='btn btn-success' onClick={handleSubmit}>Submit</button>
                </div>
                {error && <p className='text-danger'>{error}</p>}
            </div>

            <div className='row mt-3'>
                <h3>Todos List</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Completed</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos.map((todo, index) => (
                                edit !== -1 ? <>
                                <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{todo.title}</td>
                                <td>{todo.description}</td>
                                <td>{todo.completed? 'Yes' : 'No'}</td>
                                <td>{ new Date(todo.date).toLocaleString()}</td>
                                <td>
                                    <button className='btn btn-primary me-3' onClick={()=>{setEdit(todo._id)}} >Edit</button>
                                    <button className='btn btn-danger'>Delete</button>
                                </td>
                            </tr>
                                </>:<>
                                {message && <p className='text-success'>{message}</p>}
                                <div className='form-group d-flex gap-2'>
                                    <input
                                        type='text'
                                        className='form-control form-control-md '
                                        value={title}
                                        onChange={(e) => { seteditTitle(e.target.value) }}
                                        placeholder='Enter Todo'
                                    />
                                    <input
                                        className='form-control'
                                        value={description}
                                        onChange={(e) => { seteditDescription(e.target.value) }}
                                        type='text'
                                        placeholder='Enter description'
                                    />
                                    <button className='btn btn-success' onClick={handleSubmit}>Submit</button>
                                </div>
                                {error && <p className='text-danger'>{error}</p>}
                                </>
                            // <tr key={index}>
                            //     <td>{index + 1}</td>
                            //     <td>{todo.title}</td>
                            //     <td>{todo.description}</td>
                            //     <td>{todo.completed? 'Yes' : 'No'}</td>
                            //     <td>{ new Date(todo.date).toLocaleString()}</td>
                            //     <td>
                            //         <button className='btn btn-primary me-3' onClick={()=>{setEdit(todo._id)}} >Edit</button>
                            //         <button className='btn btn-danger'>Delete</button>
                            //     </td>
                            // </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Todos;
