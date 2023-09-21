import config from "config/config"
import axios from "axios"

import * as url from "../helpers/url_helper"

export const AttendanceApi = {
  getAllStudentList: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.GET_ATTENDANCE_LIST}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  takeStudentAttendance: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.STUDENT_ATTENDANCE}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  getStudentAttendanceDetails: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.STUDENT_ATTENDANCE_DETAILS}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  generateAttendanceReport: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.Generate_AttendanceReport}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
}
