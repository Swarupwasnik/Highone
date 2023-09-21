import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const HolidayApi = {
  getHoliday: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.GET_HOLIDAY}`,
      data,
    }
    return await axios(axiosConfig)
  },
  createHoliday: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.ADD_HOLIDAY}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  deleteHoliday:async(data)=>{
    var axiosConfig={
      method:"POST",
      url:`${config.API_URL}${url.DELETE_HOLIDAY}`,
      data
    }
    return await axios(axiosConfig)
  }
}
