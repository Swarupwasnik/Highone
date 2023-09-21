import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const TimetableApi = {
  getTimetable: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.GET_TIMETABLE}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  createTimetable: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.ADD_TIMETABLE}`,
      headers: {
        // "Content-Type":'application/json'
      },
      data,
    }
    return await axios(axiosConfig)
  },
  deleteTimetable: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.DELETE_TIMETABLE}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
}
