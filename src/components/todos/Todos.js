import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/userActions";
import axios from "axios";
import { todoStatuses } from "../../constants";
import './Todos.scss';

export default function Todos() {
    const [todosList, setTodosList] = useState([]);
    const [todoInput, setTodoInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState(null);
    const dispatch = useDispatch();

    useEffect( () => {
        getTodos();
    }, [filterStatus]);
    const getTodos = async () => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/todos`, {
            params: {
                status: filterStatus
            }
        })
        .then(response => {
            if(response.data){
                setTodosList(response.data);
            }
        }).catch((e) => {
            setErrorMessage(e?.response?.data?.message || 'Something went wrong');
        });
    }

    const addTodo = async (e) => {
        if(e.key === 'Enter'){
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/todos`, {
                title: e.target.value
            })
            .then(response => {
                if(response.data){
                    setTodosList([response.data, ...todosList])
                    setTodoInput('');
                }
            }).catch((e) => {
                setErrorMessage(e?.response?.data?.message || 'Something went wrong');
            });
        }
    }

    const deleteTodo = async (id) => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/todos/${id}`)
            .then(response => {
                let todoIndex = todosList.findIndex((item) => item.id === id);

                if(todoIndex > -1){
                    todosList.splice(todoIndex, 1)
                    setTodosList([...todosList])
                }
            }).catch((e) => {
            setErrorMessage(e?.response?.data?.message || 'Something went wrong');
        });
    }

    const handleTodoInputChange = (e) => {
        setTodoInput(e.target.value);
    }

    const handleTodoElementChange = (e, id) => {
        const shouldComplete = e.target.checked;

        axios.put(`${process.env.REACT_APP_BACKEND_URL}/todos/${id}/${shouldComplete ? 'set-completed' : 'set-uncompleted'}`)
            .then(response => {
                let todoIndex = todosList.findIndex((item) => item.id === id);
                todosList[todoIndex].status = shouldComplete ? todoStatuses.COMPLETED : todoStatuses.UNCOMPLETED;

                setTodosList([...todosList])
            }).catch((e) => {
            setErrorMessage(e?.response?.data?.message || 'Something went wrong');
        });
    }

    return (
        <div id="todos-container">
            <button id="logout" onClick={() => dispatch(logout({}))}>Logout</button>
            <img src="/logo.svg" id="todo-logo" />
            <span id="todo-title">Todo List</span>
            <span className="error">{errorMessage}</span>
            <input id="todo-input" onChange={handleTodoInputChange} onKeyDown={addTodo} value={todoInput} placeholder="Add a new todo" type="text" />
            <div id="todo-elements">
                {todosList.map((todo) => {
                    return (
                        <div key={todo.id} className="todo-element">
                            <input type="checkbox" onChange={(e) => handleTodoElementChange(e, todo.id)} checked={todo.status === todoStatuses.COMPLETED}/>
                            <span>{todo.title}</span>
                            <div onClick={() => deleteTodo(todo.id)} className="close">
                                <img src="/close.svg" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div id="filter-menu">
                <span id="show">Show: </span>
                {filterStatus !== null ? <a href="#" onClick={() => setFilterStatus(null)}>All</a> : <span>All</span>}
                {filterStatus !== todoStatuses.COMPLETED ? <a href="#" onClick={() => setFilterStatus(todoStatuses.COMPLETED)}>Completed</a> : <span>Completed</span>}
                {filterStatus !== todoStatuses.UNCOMPLETED ? <a href="#" onClick={() => setFilterStatus(todoStatuses.UNCOMPLETED)}>Uncompleted</a> : <span>Uncompleted</span>}
            </div>
        </div>
    );
}