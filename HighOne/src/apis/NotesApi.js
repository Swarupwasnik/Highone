import config from "config/config";
import axios from "axios";
import * as url from '../helpers/url_helper'

export const NotesApi={
    GetNotes:async(data)=>{
        var axiosConfig={
            method:'post',
            url:`${config.API_URL}${url.GET_NOTES_LIST}?page=${data.resultPerPage}`,
            headers:{
                "Content-Type":"application/json"
            },
            data
        }

        return await axios(axiosConfig)
    },

    deleteNotes:async(data)=>{
        var axiosConfig={
            method:'post',
            url:`${config.API_URL}${url.DELETE_NOTES}`,
            headers:{
                "Content-Type":"application/json"
            },
            data
        }
        return await axios(axiosConfig)
    },

    createNotes:async(data)=>{
        var axiosConfig={
            method:'post',
            url:`${config.API_URL}${url.CREATE_NOTE}`,
            headers:{
                // "Content-Type":"application/json"
            },
            data
        }
        return await axios(axiosConfig)
    },

    getClasswiseSection:async(data)=>{
        var axiosConfig={
            method:'POST',
            url:`${config.API_URL}${url.GET_CLASSWISE_SECTION}`,
            headers:{
                "Content-Type":'application/json'
            },data
        }
        return await axios(axiosConfig)
    },

    GetAllNotes:async(data)=>{
        var axiosConfig={
            method:'GET',
            url:`${config.API_URL}${url.GET_ALLNOTES_LIST}`,
            headers:{
                "Content-Type":"application/json"
            },
            
        }

        return await axios(axiosConfig)
    },
}