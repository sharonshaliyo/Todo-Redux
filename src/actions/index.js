import { CALL_API } from '../middleware/api'

export const FETCH_TASKS_STARTED = 'FETCH_TASKS_STARTED';
export const FETCH_TASKS_SUCCEEDED = 'FETCH_TASKS_SUCCEEDED';
export const FETCH_TASKS_FAILED = 'FETCH_TASKS_FAILED';

// export function fetchTasks() {
//     return {
//         [CALL_API]: {
//             types: [FETCH_TASKS_STARTED, FETCH_TASKS_SUCCEEDED, FETCH_TASKS_FAILED],
//             endpoint: '/tasks'
//         }
//     }
// }

export function fetchTasks() {
    return { type: 'FETCH_TASKS_STARTED' }
}

export const CREATE_TASKS_STARTED = 'CREATE_TASKS_STARTED';
export const CREATE_TASKS_SUCCEEDED = 'CREATE_TASKS_SUCCEEDED';
export const CREATE_TASKS_FAILED = 'CREATE_TASKS_FAILED';

export function createTask({ title, description, status = "Unstarted"}) {
    return {
        [CALL_API]: {
            types: [CREATE_TASKS_STARTED, CREATE_TASKS_SUCCEEDED, CREATE_TASKS_FAILED],
            endpoint: '/tasks',
            method: 'POST',
            body: {
                title,
                description,
                status
            }
        }
    }
}

function progressTimerStart(taskId) {
    return { type: 'TIMER_STARTED', payload: { taskID }}
}

export function editTask(id, params = {}) {
    return (dispatch, getState) => {
        const task = getTaskById(getState().tasks.tasks, id)
        const updatedTask = {
            ...task,
            ...params
        }
        api.editTask(id, updatedTask).then(resp => {
            dispatch(editTaskSucceeded(resp.data))
            if (resp.data.status === 'In Progress') {
                dispatch(progressTimerStart(resp.data.id))
            }

            if (task.status == 'In Progress') {
                return dispatch(progressTimerStop(resp.data.id))
            }
        })
    }
}


function* progressTimerStop(taskId) {
    return {
        type: "TIMER_STOPPED",
        payload: { taskId }
    }
}
