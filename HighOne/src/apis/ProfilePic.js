import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const ProfilePic = {
  GetAllStudent: async data => {
    var axiosConfig = {
      method: "GET",
      url: `${config.API_URL}${url.Get_UnverifyProfile_Student}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
  VerifyStudent: async data => {
    var axiosConfig = {
      method: "POST",
      url: `${config.API_URL}${url.Verify_Profile}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
}
