import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const CircularApi = {
  createCircular: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.CREATE_CIRCULAR}`,
      headers: {
        // "Content-Type":"application/json"
      },
      data,
    }
    return await axios(axiosConfig)
  },
  updateCircular: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.UPDATE_CIRCULAR}`,
      headers: {
        // "Content-Type":"application/json"
      },
      data,
    }
    return await axios(axiosConfig)
  },

  getCircular: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.GET_CIRCULAR}?page=${data.resultPerPage}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  deleteCircular: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.DELETE_CIRCULAR}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  getSingleCircular: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.SHOW_SINGLE_CIRCULAR}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
}
