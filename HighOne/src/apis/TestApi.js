import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const TestApi = {
  createTestQuiz: async data => {
    console.log(data, "data")
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.CREATE_TEST}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  getAllTestQuiz: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.GET_TEST_LIST}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  deleteTestQuiz: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.DELETE_TEST}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }

    return await axios(axiosConfig)
  },
  ViewTestQuiz: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.VIEW_TESTQUE}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }

    return await axios(axiosConfig)
  },
  showTestQuestion: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.SHOW_TEST_QUESTION}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  getNoOfQuestion: async data => {
    var axiosConfig = {
      method: "GET",
      url: `${config.API_URL}${url.GET_NOOF_QUESTION}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }

    return await axios(axiosConfig)
  },
  getTestDuration: async data => {
    var axiosConfig = {
      method: "GET",
      url: `${config.API_URL}${url.GET_TEST_DURATION}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }

    return await axios(axiosConfig)
  },
  getTestResult: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.Get_TestReport}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
  getTestAnswer: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.GetTestReport_History}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
}
