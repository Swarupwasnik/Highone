import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const SyllabusApi = {
  createSyllabus: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.ADD_SYLLABUS}`,
      headers: {
        // "Content-Type":"application/json"
      },
      data,
    }
    return await axios(axiosConfig)
  },
  

  getSyllabus: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.GET_SYLLABUS}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  deleteSyllabus: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.DELETE_SYLLABUS}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  
}
