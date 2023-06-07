import axios from 'axios'
import config from '../config'

const baseUrl = `${config.backend}admin/`

export const registerUser = async (data) => {
    const response = await axios.post(`${baseUrl}register`, data)
    return response.data
}

export const loginUser = async (data) => {
    const response = await axios.post(`${baseUrl}login`, data)
    return response.data
}