import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const sessionApi = {
  GetSession: async () => {
    var axiosConfig = {
      method: "GET",
      url: `${config.API_URL}${url.GET_SESSION}`,
      headers: {
        "Content-Type": "application/json",
      },
    }
    return await axios(axiosConfig)
  },
  AddSession: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.ADD_SESSION}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
  EditSession: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.EDIT_SESSION}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
  deleteSession: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.DELETE_SESSION}`,
      headers: {
        "Content-Type": "application/json",
      },
      data
    }
    return await axios(axiosConfig)
  },
}
