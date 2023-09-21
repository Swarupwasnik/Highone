import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const DashboardAPI = {
  getDashboard: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.DASHBOARD}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
}