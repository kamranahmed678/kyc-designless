import axios from 'axios'
import config from '../config'

const baseUrl = `${config.backend}global/`

export const getCountries = async(data) => {
    const response = await axios.get(`${baseUrl}countries`)
    return response.data
  }