import config from "config/config"
import axios from "axios"

import * as url from "../helpers/url_helper"

export const AnnualResultApi = {
  getAllClassList: async data => {
    var axiosConfig = {
      method: "GET",
      url: `${config.API_URL}${url.GET_CLASSLIST}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  getSectionList: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.GET_CLASS_SECTION}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  getStudentList: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.GET_CLASS_STUDENT_LIST}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  addAnnualResult: async data => {
    console.log(data, "api data")
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.ADD_RESULT}`,
      headers: {
        // "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  deleteResult: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.DELETE_RESULT}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  showAnnualResult: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.Show_AnnualReport}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
}
