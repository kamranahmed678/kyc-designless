import axios from 'axios'
import config from '../config'

const baseUrl = `${config.backend}company/`

export const getAllCompanyKycs = async(companyId,filteredConfig) => {
    const response = await axios.get(`${baseUrl}company-kycs?_id=${companyId}&configId=${filteredConfig}`)
    return response.data
  }

export const getKycDetails = async(data) => {
    const response = await axios.get(`${baseUrl}getdetails?kycId=${data}`)
    return response.data
  }

  export const getKycCount = async(companyId,filteredConfig) => {
    const response = await axios.get(`${baseUrl}getstats?_id=${companyId}&configId=${filteredConfig}`)
    return response.data
  }

  export const getAccessKey = async(data) => {
    const response = await axios.get(`${baseUrl}getkey?_id=${data}`)
    return response.data
  }

  export const generateAccessKey = async (data) => {
    const response = await axios.post(`${baseUrl}generatekey`, data)
    return response.data
}

export const getWebsiteUrl = async(data) => {
  const response = await axios.get(`${baseUrl}getwebsiteurl?_id=${data}`)
  return response.data
}

export const setWebsUrl = async (data) => {
  const response = await axios.post(`${baseUrl}setwebsiteurl`, data)
  return response.data
}

export const getRedirectUrl = async(data) => {
  const response = await axios.get(`${baseUrl}getredirecturl?_id=${data}`)
  return response.data
}

export const setRdirectUrl = async (data) => {
  const response = await axios.post(`${baseUrl}setredirecturl`, data)
  return response.data
}

export const getWebhook = async(data) => {
  const response = await axios.get(`${baseUrl}getwebhookurl?_id=${data}`)
  return response.data
}

export const setWebhook = async (data) => {
  const response = await axios.post(`${baseUrl}setwebhookurl`, data)
  return response.data
}

export const getConfig = async(data) => {
  const response = await axios.get(`${baseUrl}getallconfig?_id=${data}`)
  return response.data
}

export const createConfig = async (data) => {
  const response = await axios.post(`${baseUrl}createnewconfig`, data)
  return response.data
}