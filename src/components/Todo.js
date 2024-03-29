import React, { useState } from 'react';
import TodoForm from './TodoForm.js';
import {
	RiCloseCircleLine,
	RiCheckboxCircleFill,
} from 'react-icons/ri/index.esm.js';
import { TiEdit } from 'react-icons/ti/index.esm.js';

const Todo = ({ todos, completeTodo, removeTodo, updateTodo }) => {
	const [edit, setEdit] = useState({
		id: null,
		value: '',
	});

	const submitUpdate = (value) => {
		updateTodo(edit.id, value);
		setEdit({
			id: null,
			value: '',
		});
	};

	if (edit.id) {
		return <TodoForm edit={edit} onSubmit={submitUpdate} />;
	}

	return todos.map((todo, index) => (
		<div
			className={todo.isComplete ? 'todo-row complete' : 'todo-row'}
			key={index}>
			<div key={todo.id}>{todo.text}</div>

			<div className="icons">
				<button className="complete-icon" onClick={() => completeTodo(todo.id)}>
					<RiCheckboxCircleFill />
				</button>
				<button className="delete-icon" onClick={() => removeTodo(todo.id)}>
					<RiCloseCircleLine />
				</button>
				<TiEdit
					onClick={() => setEdit({ id: todo.id, value: todo.text })}
					className="edit-icon"
				/>
			</div>
		</div>
	));
};

export default Todo;
