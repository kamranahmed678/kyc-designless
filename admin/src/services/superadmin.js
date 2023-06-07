import axios from 'axios'
import config from '../config'

const baseUrl = `${config.backend}admin/`

export const getAllUsers = async(data) => {
    const response = await axios.get(`${baseUrl}getall`)
    return response.data
}

export const getKycCounts = async(data) => {
    const response = await axios.get(`${baseUrl}getkyccount`)
    return response.data
}

export const editApproval = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(`${baseUrl}editapproval`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const deleteUser = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(`${baseUrl}delete`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const reverseDeleteUser = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(`${baseUrl}undelete`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

