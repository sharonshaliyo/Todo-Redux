import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, TextField } from '@mui/material'

import TaskList from './TaskList'
// import createTask from '../actions/tasks.js'
import { fetchTasks, createTask } from '../actions/index.js'

const TASK_STATUSES = ['Unstarted', 'In Progress', 'Completed']
class TasksPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showNewCardForm: false,
            title: '',
            description: ''
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchTasks('tasks'))
    }

    onTitleChange = (e) => {
        this.setState({ title: e.target.value })
    }

    onDescriptionChange = (e) => {
        this.setState({ description: e.target.value })
    }
    resetForm() {
        this.setState({
            showNewCardForm: false,
            title: '',
            description: '',
        })
    }
    onCreateTask = (e) => {
        e.preventDefault()
        // this.props.onCreateTask({
        //     title: this.state.title,
        //     description: this.state.description,
        // })
        this.props.dispatch(createTask({
            title: this.state.title,
            description: this.state.description,
        }))
        this.resetForm()
    }
    toggleForm = () => {
        this.setState({ showNewCardForm: !this.state.showNewCardForm })
    }

    onSearch = e => {
        console.log('Search term', e.target.value)
        this.props.onSearch(e.target.value)
    }

    renderTaskLists() {
        const { onStatusChange, tasks } = this.props

        const filteredTasks = tasks.filter(task => {
            return task.title.match(new RegExp(this.state.searchTerm, 'i'))
        })

        return TASK_STATUSES.map(status => {
            const statusTasks = tasks.filter(task => task.status === status)
            return <TaskList
                key={status}
                status={status}
                tasks={statusTasks}
                onStatusChange={onStatusChange}
            />
        })
    }
    render() {
        if (this.props.isLoading) {
            return <div className='tasks-loading'>Loading ...</div>
        }

        return (
            <div className="task-list">
                <div className="tasks-header task-list-header">
                    <TextField
                        onChange={this.onSearch}
                        type="text"
                        label="Search..."
                    />
                    <Button
                        variant="contained"
                        className="button button-default"
                        onClick={this.toggleForm}
                    >
                        + New task
                    </Button>
                </div>
                {this.state.showNewCardForm && (
                    <form className="task-list-form" onSubmit={this.onCreateTask}>
                        <TextField
                            className="full-width-input"
                            onChange={this.onTitleChange}
                            value={this.state.title}
                            type="text"
                            label="title"
                        />
                        <TextField
                            className="full-width-input"
                            onChange={this.onDescriptionChange}
                            value={this.state.description}
                            type="text"
                            label="description"
                        />
                        <Button
                            variant="contained"
                            className="button"
                            type="submit"
                        >
                            Save
                        </Button>
                    </form>
                )}

                <div className="task-lists">
                    {this.renderTaskLists()}
                </div>
            </div>
        )
    }

}

// function mapDispatchToProps(dispatch) {
//     return {
//         onCreateTask: (t) => dispatch({ type: "CREATE_TASK", payload: t })
//     }
// }

// export default connect(null, mapDispatchToProps)(TasksPage)

export default connect()(TasksPage)
