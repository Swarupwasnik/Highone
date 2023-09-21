import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const ExamTestApi = {
  createExamTestQuiz: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.Add_TestQuizInformation}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  updateExamTestQuiz: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.Update_TestQuizInformation}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  createExamTestQuestion: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.Add_TestQuizQuestion}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  viewExamTestQuestion: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.View_TestQuestion}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  deleteExamTestQuestion: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.Delete_Question}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },

  ActiveInactiveExam: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.TestQuiz_ActiveInactive}`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    }
    return await axios(axiosConfig)
  },
}
