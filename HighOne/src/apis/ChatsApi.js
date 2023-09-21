import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const GetAllTeacher = {
  GetAllTeacher: async data => {
    var axiosConfig = {
      method: "get",
      url: `${config.API_URL}${url.GET_ALL_USERS}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
  GetSingleUser: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.GET_SINGLE_USER}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
  UpdateOnlieOfflineStatus: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.UpdateOnlieOfflineStatus}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
}
