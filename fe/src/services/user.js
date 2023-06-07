import axios from 'axios'
import config from '../config'

const baseUrl = `${config.backend}user/`

export const loginUser = async (data) => {
    const response = await axios.post(`${baseUrl}login`, data)
    return response.data
}

export const selectDocumentType = async (data) => {
    const response = await axios.post(`${baseUrl}selectdoc`, data)
    return response.data
}

export const uploadDocument = async (data) => {
    const response = await axios.post(`${baseUrl}uploaddoc`, data)
    return response.data
}

export const uploadSelfie = async (data) => {
    const response = await axios.post(`${baseUrl}uploadselfie`, data)
    return response.data
}

export const doKyc = async(data) => {
    const response = await axios.get(`${baseUrl}dokyc?email=${data}`)
    return response.data
  }