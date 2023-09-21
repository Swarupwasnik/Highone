import config from "config/config"
import axios from "axios"
import * as url from "../helpers/url_helper"

export const PostApi = {
  GetPost: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.GET_POST}?page=${data.resultPerPage}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
  createPost: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.ADD_POST}`,
      headers: {
        // "Content-Type":'application/json'
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
  editPost: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.EDIT_POST}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }

    return await axios(axiosConfig)
  },
  updatePost: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.UPDATE_POST}`,
      headers: {
        // 'Content-Type': 'application/json'
      },
      data: data,
    }

    return await axios(axiosConfig)
  },

  likeUnlike: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.POST_LIKE}`,
      headers: {
        // "Content-Type":'application/json'
      },
      data: data,
    }
    return await axios(axiosConfig)
  },

  deletePost: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.DELETE_POST}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }

    return await axios(axiosConfig)
  },

  comment: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.POST_COMMENT}`,
      header: {
        "Content-Type": "application/json",
      },
      data: data,
    }
    return await axios(axiosConfig)
  },
  deleteComment: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.DELETE_COMMENT}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }

    return await axios(axiosConfig)
  },
  commentLikeUnlike: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.COMMENT_LIKE_UNLIKE}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }

    return await axios(axiosConfig)
  },

  StudentBlockUnBlock: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.COMMENT_BLOCK_UNBLOCK}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }

    return await axios(axiosConfig)
  },
  postReplay: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.POST_REPLAY}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }

    return await axios(axiosConfig)
  },
  editpostReplay: async data => {
    var axiosConfig = {
      method: "post",
      url: `${config.API_URL}${url.EditCommentReplyApi}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    }

    return await axios(axiosConfig)
  },
}
