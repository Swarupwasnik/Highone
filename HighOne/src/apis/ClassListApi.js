import config from "config/config";
import axios from "axios";

import * as url from '../helpers/url_helper'

export const classApi={
    getAllClass:async(data)=>{
        var axiosConfig={
            method:"get",
            url:`${config.API_URL}${url.GET_CLASS_LIST}`,
            headers:{
                "Content-Type":"application/json"
            }
        }
        return await axios(axiosConfig)
    },

    getTeacherSubject:async(data)=>{
        var axiosConfig={
            method:'POST',
            url:`${config.API_URL}${url.TEACHER_SUBJECT_LIST}`,
            headers:{
                'Content-Type':'application/json'
            },data
        }

        return await axios(axiosConfig)
    }
}