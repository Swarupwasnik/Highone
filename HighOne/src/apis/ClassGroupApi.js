import config from "config/config"
import axios from "axios"

import * as url from "../helpers/url_helper"

export const classGroupApi = {
  getClassGroup: async data => {
    var axiosConfig = {
      method: "get",
      url: `${config.API_URL}${url.GetGroupofclass}`,
      headers: {
        "Content-Type": "application/json",
      },
    }
    return await axios(axiosConfig)
  },

  addClassGroup: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.AddGropofClass}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }

    return await axios(axiosConfig)
  },

  removeClassGroup: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.DeleteGroupofClass}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }

    return await axios(axiosConfig)
  },
}
