import config from "config/config";
import axios from "axios";
import * as url from '../helpers/url_helper'

export const AcademicCalenderApi={ 
    GetAcademicCalender:async (data) => {
        var axiosConfig={
            method:'POST',
            url:`${config.API_URL}${url.GET_ACADEMIC_CALENDER}`,
            headers:{
                "Content-Type":'application/json'
            },
            data:data
        }
        return await axios(axiosConfig)

    },
    deleteAcademicCalender:async (data) => {
        var axiosConfig={
            method:'POST',
            url:`${config.API_URL}${url.DELETE_ACADEMIC_CALENDER}`,
            headers:{
                "Content-Type":'application/json'
            },
            data
        }
        return await axios(axiosConfig)

    },
    createAcademicCalender:async (data) => {
       
        var axiosConfig={
            method:'POST',
            url:`${config.API_URL}${url.CREATE_ACADEMIC_CALENDER}`,
            headers:{
                // "Content-Type":'application/json'
            },
            data:data
        }
        return await axios(axiosConfig)

    },    
} 