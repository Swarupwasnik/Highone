import React, { useState, useEffect, useRef, useContext } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  Col,
  NavItem,
  NavLink,
  Form,
  Input,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Row,
  TabContent,
  TabPane,
  Button,
  CardBody,
  UncontrolledTooltip,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap"
import img1 from "../../../assets/image/like.png"
import img2 from "../../../assets/image/happy.png"
import img3 from "../../../assets/image/smile.png"
import PerfectScrollbar from "react-perfect-scrollbar"
import Pagination from "react-js-pagination"
import { PostApi } from "apis/PostApi"
import Swal from "sweetalert2"
//import images
import { useFormik } from "formik"
import * as Yup from "yup"
import config from "config/config"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en.json"
import ru from "javascript-time-ago/locale/ru.json"
import ReactTimeAgo from "react-time-ago"
import moment from "moment"
import Loading from "components/Loading"
import { SessionContext } from "context/sessionContext"

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const PostList = () => {
  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")
  const [CurrentPage, setCurrentPage] = useState(1)
  const [Page, setPage] = useState(1)
  const resultPerPage = 10

  const name = JSON.parse(localStorage.getItem("User"))
  const [activeTab, toggleTab] = useState("1")
  const [postData, setPostData] = useState([])
  const [count, setCount] = useState(0)
  const [count1, setCount1] = useState(0)
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState(false)
  const [postIdValue, setPostIdValue] = useState()
  const [postIdCount, setpostIdCount] = useState()
  const [commentId, setCommentId] = useState(false)
  const [commentList, setCommentList] = useState(2)
  const [loader, setLoader] = useState()
  const [thumbCount, setThumbCount] = useState()
  const [angryCount, setAngryCount] = useState()
  const [smileCount, setSmileCount] = useState()
  const [joyCount, setJoyCount] = useState()
  const [truncate, settruncate] = useState(true)
  const [replay, setReplay] = useState(false)
  const [Editreplay, setEditReplay] = useState(false)
  const [replytxtbox, setReplytxtbox] = useState("")
  const [replayCommId, setReplayCommId] = useState("")
  const [modal, setModal] = useState(false)
  const [modal_large, setmodal_large] = useState(false)
  // console.log(replayCommId)
  // console.log(replytxtbox)

  const teacherCode = {
    user_type: name == "Admin" ? "Admin" : "Teacher",
    teacher_code: name?.payload?.t_code ? name?.payload?.t_code : "",
    class: "",
    section: "",
    resultPerPage: CurrentPage,
    session_id: session,
  }

  useEffect(() => {
    if (postData?.length === 0) {
      setLoader(<Loading />)
    }
    getPostList(teacherCode)
  }, [CurrentPage, commentId, session])

  const getPostList = data => {
    PostApi.GetPost(data)
      .then(res => {
        if (res.data.status === 200) {
          setLoader("")
        }
        setPostData(res.data.post)
        setPage(res.data.post_count)
        // setComments(res.data.post)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const likeDislike = (id, emoji) => {
    setpostIdCount(id)
    let likeData = {
      like_by: name == "Admin" ? "Admin" : "Teacher",
      post_id: id,
      t_code: name?.payload?.t_code,
      emoji_type: emoji,
    }

    PostApi.likeUnlike(likeData)
      .then(res => {
        if (res.data.post_id === likeData.post_id) {
          setAngryCount(res.data.angry_likecount)
          setThumbCount(res.data.thumb_likecount)
          setSmileCount(res.data.smile_likecount)
          setJoyCount(res.data.joy_likecount)
          getPostList(teacherCode)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleCommentChange = event => {
    setComment(event.target.value)
  }

  const onPostId = postId => {
    setPostIdValue(postId)
  }
  const getCommentId = commentIdValue => {
    setCommentId(commentIdValue)
  }

  const onDelete = id => {
    const postId = { post_id: id }
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        PostApi.deletePost(postId)
          .then(res => {
            Swal.fire("Deleted!", res.data.msg, "success")
            getPostList(teacherCode)
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  const validationType = useFormik({
    enableReinitialize: true,
    initialValues: {
      fk_post: postIdValue ? Number(postIdValue) : "",
      student_code: "",
      comment: comment ? comment : "",
      comment_by: name == "Admin" ? name : "Teacher",
      st_name: name?.payload?.t_name ? name?.payload?.t_name : "Admin",
      profile_image: name?.payload?.profile_pic_url
        ? name?.payload?.profile_pic_url
        : "",
    },
    validationSchema: Yup.object().shape({
      comment: Yup.string().required("This is required"),
    }),
    onSubmit: values => {
      PostApi.comment(values)
        .then(res => {
          if (res.data.status === 200) {
            setComment("")
            getPostList(teacherCode)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
  })
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      reply: "",
      fk_comment: replayCommId,
      teacher_code: name?.payload?.t_code ? name?.payload?.t_code : "",
      teacher_name: name?.payload?.t_name ? name?.payload?.t_name : "Admin",
      reply_by: name == "Admin" ? name : "Teacher",
      profile_image: name?.payload?.profile_pic_url
        ? name?.payload?.profile_pic_url
        : "",
    },
    validationSchema: Yup.object().shape({
      reply: Yup.string().required("required"),
    }),
    onSubmit: values => {
      // console.log(values)
      PostApi.postReplay(values)
        .then(res => {
          if (res.data.status === 200) {
            setReplay(false)
            getPostList(teacherCode)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
  })

  const [editReply, setEditReply] = useState("")
  const EditCommentReplyApi = async (reply_id, reply) => {
    if (!editReply) {
      alert("Please type some comment")
    } else {
      try {
        let body = {
          reply_id: reply_id,
          teacher_code: name?.payload?.t_code ? name?.payload?.t_code : "",
          teacher_name: name?.payload?.t_name ? name?.payload?.t_name : "Admin",
          reply: reply,
          reply_by: name == "Admin" ? name : "Teacher",
          profile_image: name?.payload?.profile_pic_url
            ? name?.payload?.profile_pic_url
            : "",
        }
        await PostApi.editpostReplay(body).then(res => {
          if (res.data.status === 200) {
            setEditReplay(false)
            getPostList(teacherCode)
            setEditReply("")
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const commentLikeUnlike = id => {
    let commentLikeUnlikeData = {
      comment_id: id,
      student_code: "",
      teacher_code: name?.payload?.t_code,
      like_by: name == "Admin" ? "Admin" : "Teacher",
      emoji_type: "Thumb",
    }

    PostApi.commentLikeUnlike(commentLikeUnlikeData)
      .then(res => {
        if (res.data.status === 200) {
          getPostList(teacherCode)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deleteComment = id => {
    let commentId = { comment_id: id }
    PostApi.deleteComment(commentId)
      .then(res => {
        if (res.data.status === 200) {
          // setCurrentPage(res.data.post_count)
          setComment("")
          getPostList(teacherCode)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const StudentBlockUnBlock = (id, student_code) => {
    let dataPost = {
      post_id: id,
      student_code: student_code,
      teacher_code: name?.payload?.t_code,
    }
    PostApi.StudentBlockUnBlock(dataPost)
      .then(res => {
        if (res.data.status === 200) {
          getPostList(teacherCode)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const toggle = () => {
    if (modal) {
      formClear()
      setModal(false)
    } else {
      setModal(true)
    }
  }
  const imagetoggle = () => {
    if (modal_large) {
      setmodal_large(false)
    } else {
      setmodal_large(true)
    }
  }

  const formClear = () => {
    validation.resetForm()
  }

  const handlePostClick = arg => {
    toggle()
  }
  const handleImgClick = arg => {
    imagetoggle()
  }

  // comma
  const convertStr = val => {
    let str = JSON.parse(val).map((item, i) => " " + item.label.toUpperCase())
    str = str.toString()
    str = str.slice(0, str.length - 1).trim()
    return str
  }

  return (
    <React.Fragment>
      <Col xl={11} lg={12} className="mx-auto">
        <Row>
          <Col>
            <Card className="bg-transparent shadow-none pt-2">
              <CardBody className="p-0 text-end">
                <Link to="/add-post">
                  <Button
                    color="primary"
                    className="btn btn-primary waves-effect waves-light"
                  >
                    <i className="bx bxs-add-to-queue p-1"></i>
                    Create post
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <TabContent className="" activeTab={activeTab}>
          {loader ? <div>{loader}</div> : null}
          <Row className="">
            {postData &&
              postData.map((item, index) => (
                <Col key={index} sm={6} lg={6} className="relative">
                  <Card className="p-2">
                    <Row className="">
                      <Col sm={9}>
                        <h5 className="text-uppercase fw-bold">{item.title}</h5>
                        <p className="text-muted">
                          {moment(item.created_date).format(
                            "DD-MM-YYYY , hh:mm A"
                          )}
                        </p>
                        <span>
                          <b>Class</b> : {convertStr(item.st_class)}
                          {/* {JSON.parse(item.st_class).map(
                            (item, i) => item.label.toUpperCase() + ", "
                          )} */}
                        </span>
                        <br></br>
                        <span>
                          <b>Subject</b> : {convertStr(item.subject_code)}
                          {/* {JSON.parse(item.subject_code).map(
                            (item, i) => item.label + ", "
                          )} */}
                        </span>
                      </Col>
                      <Col sm={3}>
                        <div className="float-end">
                          <ul className="nav nav-pills">
                            <NavItem>
                              <Link
                                className="text-success"
                                to={`/edit-post/${item.id}`}
                              >
                                <i
                                  className="mdi mdi-pencil font-size-18"
                                  id="edittooltip"
                                />
                                <UncontrolledTooltip
                                  placement="top"
                                  target="edittooltip"
                                >
                                  Edit
                                </UncontrolledTooltip>
                              </Link>{" "}
                              <Link
                                to="#"
                                className="badge  font-size-18 text-danger"
                              >
                                <i
                                  className="mdi mdi-delete font-size-18"
                                  id="deletetooltip"
                                  onClick={() => onDelete(item.id)}
                                />
                                <UncontrolledTooltip
                                  placement="top"
                                  target="deletetooltip"
                                >
                                  Delete
                                </UncontrolledTooltip>
                              </Link>
                            </NavItem>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                    <div className="pt-3">
                      <p className={truncate ? "text-truncate" : ""}>
                        {item.description.slice(0, 70)}
                        {item.description?.length >= 80 ? (
                          <p
                            className="text-primary cursor"
                            // onClick={() => settruncate(!truncate)}
                            onClick={() => {
                              // settruncate(!truncate),
                              getCommentId(item.id),
                                // setCommentList(3),
                                handlePostClick()
                            }}
                          >
                            {truncate ? "see more" : "see more"}
                          </p>
                        ) : (
                          " "
                        )}
                      </p>
                    </div>
                    <div className="position-relative">
                      {item.media.split(".").at(-1) === "jpg" && (
                        <img
                          src={`${config.BaseImageUrl}/${item.media}`}
                          alt=""
                          style={{ height: "300px", width: "550px" }}
                          className="img-thumbnail"
                          onClick={() => {
                            handleImgClick(), getCommentId(item.id)
                          }}
                        />
                      )}
                      {item.media.split(".").at(-1) === "ico" && (
                        <img
                          src={`${config.BaseImageUrl}/${item.media}`}
                          alt=""
                          style={{ height: "300px", width: "550px" }}
                          className="img-thumbnail"
                          onClick={() => {
                            handleImgClick(), getCommentId(item.id)
                          }}
                        />
                      )}
                      {item.media.split(".").at(-1) === "jpeg" && (
                        <img
                          src={`${config.BaseImageUrl}/${item.media}`}
                          alt=""
                          style={{ height: "300px", width: "550px" }}
                          className="img-thumbnail"
                          onClick={() => {
                            handleImgClick(), getCommentId(item.id)
                          }}
                        />
                      )}
                      {item.media.split(".").at(-1) === "webp" && (
                        <img
                          src={`${config.BaseImageUrl}/${item.media}`}
                          alt=""
                          style={{ height: "300px", width: "550px" }}
                          className="img-thumbnail"
                          onClick={() => {
                            handleImgClick(), getCommentId(item.id)
                          }}
                        />
                      )}
                      {item.media.split(".").at(-1) === "png" && (
                        <img
                          src={`${config.BaseImageUrl}/${item.media}`}
                          alt=""
                          style={{ height: "300px", width: "550px" }}
                          className="img-thumbnail"
                          onClick={() => {
                            handleImgClick(), getCommentId(item.id)
                          }}
                        />
                      )}
                      {item.media.split(".").at(-1) === "pdf" && (
                        <>
                          {/* <iframe
                            src={`https://docs.google.com/viewer?url=${config.BaseImageUrl}/${item.media} &embedded=true`}
                            frameBorder="0"
                            height="300px"
                            width="100%"
                          ></iframe> */}
                          <a
                            // href={`https://docs.google.com/viewer?url=${config.BaseImageUrl}/${item.media}&embedded=true`}
                            href={`${config.BaseImageUrl}/${item.media}`}
                            className="my_post"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`${config.BaseImageUrl}/${item.thumbnail}`}
                              alt=""
                              className="img-thumbnail my_post"
                            />
                          </a>
                        </>
                      )}
                    </div>
                    <div className="pt-3 px-2">
                      {/* <p className={truncate ? "text-truncate" : ""}>
                        {item.description}
                        {item.description?.length >= 80 ? (
                          <p
                            className="text-primary cursor"
                            onClick={() => settruncate(!truncate)}
                          >
                            {truncate ? "see more" : "see less"}
                          </p>
                        ) : (
                          " "
                        )}
                      </p> */}
                      <ul className="list-inline">
                        <li className="list-inline-item mr-3">
                          <Link to="#" className="text-muted">
                            <i
                              title="Like"
                              className="align-middle text-primary me-1"
                              style={{ fontSize: "22px" }}
                              onClick={() => likeDislike(item.id, "Thumb")}
                            >
                              <img src={img1} alt="pre" width={18} />
                            </i>
                            {postIdCount === item.id && thumbCount}
                            {postIdCount != item.id && item?.thumb_likecount}
                          </Link>
                        </li>
                        <li className="list-inline-item mr-3">
                          <Link to="#" className="text-muted">
                            <i
                              title="Joy"
                              style={{ fontSize: "22px" }}
                              className="align-middle text-warning me-1"
                              onClick={() => likeDislike(item.id, "Joy")}
                            >
                              {" "}
                              <img src={img2} alt="pre" width={18} />
                              {item.count}
                            </i>{" "}
                            {postIdCount === item.id && joyCount}
                            {postIdCount != item.id && item?.joy_likecount}
                          </Link>
                        </li>
                        <li className="list-inline-item mr-3">
                          <Link to="#" className="text-muted">
                            <i
                              title="Smile"
                              style={{ fontSize: "22px" }}
                              className="align-middle text-warning me-1"
                              onClick={() => likeDislike(item.id, "Smile")}
                            >
                              {" "}
                              <img src={img3} alt="pre" width={18} />
                              {item.count}
                            </i>{" "}
                            {postIdCount === item.id && smileCount}
                            {postIdCount != item.id && item?.smile_likecount}
                          </Link>
                        </li>
                        {item.is_allow == false ? (
                          " "
                        ) : (
                          <li className="list-inline-item mr-3">
                            <Link
                              to="#"
                              className="text-muted"
                              onClick={() => {
                                getCommentId(item.id),
                                  setCommentList(3),
                                  handlePostClick()
                              }}
                              onDoubleClick={() => setCommentId(!commentId)}
                            >
                              <i
                                className="bx bx-comment-dots align-middle text-primary  me-1"
                                style={{ fontSize: "22px" }}
                              ></i>{" "}
                              {item.comment_count} Comments
                            </Link>
                          </li>
                        )}
                      </ul>
                      {/* <div className="mt-4">
                        <div className="mt-5">
                          {commentId && commentId == item.id ? (
                            <h5 className="font-size-15">
                              <i className="bx bx-message-dots text-muted align-middle me-1"></i>
                              Comments :
                              {4 < item.post_comment.length ? (
                                commentList + 1 >= item.post_comment.length ? (
                                  <Link to="#">
                                    <span
                                      style={{
                                        float: "right",
                                        textDecoration: "underline",
                                      }}
                                      onClick={() => setCommentList(2)}
                                    >
                                      see less...
                                    </span>
                                  </Link>
                                ) : commentList >= 3 ? (
                                  <Link to="#">
                                    <span
                                      style={{
                                        float: "right",
                                        textDecoration: "underline",
                                      }}
                                      onClick={() =>
                                        setCommentList(item.post_comment.length)
                                      }
                                    >
                                      see more...
                                    </span>
                                  </Link>
                                ) : null
                              ) : (
                                ""
                              )}
                            </h5>
                          ) : (
                            ""
                          )}
                          <div className={!commentId ? "d-none" : ""}>
                            {item.post_comment &&
                              item.post_comment?.map((data, index) => (
                                <>
                                  {index <= commentList ? (
                                    <div key={data.id} className="d-flex py-3">
                                      {commentId &&
                                      commentId == data.fk_post_id ? (
                                        <div className="avatar-xs me-3">
                                          <div className="avatar-title rounded-circle bg-light text-primary">
                                            <i className="bx bxs-user"></i>
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {commentId &&
                                      commentId == data.fk_post_id ? (
                                        <div className=" flex-grow-1">
                                          <div className="d-flex">
                                            <div className="d-flex align-items-center flex-grow-1">
                                              <span className=" mb-0">
                                                {data.st_name}
                                              </span>

                                              <small className="text-muted px-1">
                                                <ReactTimeAgo
                                                  date={data.comment_date}
                                                  locale="en-US"
                                                />
                                              </small>
                                            </div>
                                            <div className="d-flex align-items-center gap-4 me-auto">
                                              <div>
                                                {data.st_name !== "Admin" ? (
                                                  <Link
                                                    className=""
                                                    to="#"
                                                    onClick={() => {
                                                      setCount(count + 1)
                                                    }}
                                                  >
                                                    <i
                                                      id="delete"
                                                      className="bx bxs-message-alt-x text-dark font-size-16 mx-2"
                                                      onClick={() =>
                                                        deleteComment(data.id)
                                                      }
                                                    ></i>
                                                    <UncontrolledTooltip
                                                      placement="top"
                                                      target="delete"
                                                    >
                                                      Delete
                                                    </UncontrolledTooltip>
                                                    {data?.student_code ? (
                                                      <>
                                                        {data?.is_block ===
                                                        "True" ? (
                                                          <>
                                                            <i
                                                              id="block"
                                                              className="px-1 fas fa-ban text-dark font-size-16"
                                                              onClick={() =>
                                                                StudentBlockUnBlock(
                                                                  data.fk_post_id,
                                                                  data?.student_code
                                                                )
                                                              }
                                                            ></i>
                                                            <UncontrolledTooltip
                                                              placement="top"
                                                              target="block"
                                                            >
                                                              Block
                                                            </UncontrolledTooltip>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <i
                                                              id="unblock"
                                                              className="px-1 fas fa-unlock text-dark font-size-16"
                                                              onClick={() =>
                                                                StudentBlockUnBlock(
                                                                  data.fk_post_id,
                                                                  data?.student_code
                                                                )
                                                              }
                                                            ></i>
                                                            <UncontrolledTooltip
                                                              placement="top"
                                                              target="unblock"
                                                            >
                                                              Unblock
                                                            </UncontrolledTooltip>
                                                          </>
                                                        )}
                                                      </>
                                                    ) : null}
                                                  </Link>
                                                ) : (
                                                  name === "Admin" && (
                                                    <Link
                                                      className=""
                                                      to="#"
                                                      onClick={() => {
                                                        setCount(count + 1)
                                                      }}
                                                    >
                                                      <i
                                                        className="bx bxs-message-alt-x text-dark font-size-16"
                                                        onClick={() =>
                                                          deleteComment(data.id)
                                                        }
                                                      ></i>
                                                    </Link>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <p className="text-muted">
                                            {data.comment}
                                          </p>

                                          {data?.reply?.map((r, index) => (
                                            <div
                                              className="d-flex pt-3"
                                              key={index}
                                            >
                                              <div className="avatar-xs me-3">
                                                <div className="avatar-title rounded-circle bg-light text-primary">
                                                  <i className="bx bxs-user"></i>
                                                </div>
                                              </div>
                                              <div className="flex-grow-1">
                                                <span className="font-size-12 mb-1">
                                                  {r.teacher_name}
                                                </span>
                                                <small className="text-muted float-end">
                                                  <ReactTimeAgo
                                                    date={r.reply_date}
                                                    locale="en-US"
                                                  />
                                                </small>
                                                <p className="text-muted">
                                                  {r.reply}
                                                </p>
                                              </div>
                                            </div>
                                          ))}

                                          <span>
                                            {data?.reply?.length === 0 &&
                                            name !== "Admin" ? (
                                              <Link
                                                to="#"
                                                className="text-success"
                                                onClick={() => {
                                                  setReplay(!replay)
                                                  setReplayCommId(data.id)
                                                  setReplytxtbox(
                                                    data.fk_post_id
                                                  )
                                                }}
                                              >
                                                <i className="mdi mdi-reply"></i>
                                                Reply
                                              </Link>
                                            ) : (
                                              ""
                                            )}
                                          </span>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </>
                              ))}
                          </div>
                        </div>
                        {name !== "Admin" ? (
                          replay && replytxtbox === item.id ? (
                            <div className="flex-grow-1 fixed">
                              <Form
                                onSubmit={e => {
                                  e.preventDefault()
                                  validation.handleSubmit()
                                  return false
                                }}
                              >
                                <Col sm={10} className="m-auto">
                                  <div className="hstack">
                                    <Input
                                      className="form-control-auto"
                                      name="reply"
                                      type="text"
                                      onChange={validation.handleChange}
                                      value={validation.values.reply}
                                      invalid={
                                        validation.touched.reply &&
                                        validation.errors.reply
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.reply &&
                                    validation.errors.reply ? (
                                      <FormFeedback type="invalid">
                                        {validation.errors.reply}
                                      </FormFeedback>
                                    ) : null}

                                    <Button
                                      type="submit"
                                      color="primary"
                                      className="btn"
                                    >
                                      Reply
                                    </Button>
                                  </div>
                                </Col>
                              </Form>
                            </div>
                          ) : (
                            ""
                          )
                        ) : null}
                        {name == "Admin" ? (
                          commentId && commentId == item.id ? (
                            <div className="flex-grow-1">
                              <Form
                                onSubmit={e => {
                                  e.preventDefault()
                                  validationType.handleSubmit()
                                }}
                              >
                                <Col lg={11}>
                                  <div className="hstack">
                                    <Input
                                      className="form-control-auto"
                                      name="comment"
                                      type="text"
                                      onChange={handleCommentChange}
                                      onClick={() => onPostId(item.id)}
                                      // onBlur={validationType.handleBlur}
                                      value={
                                        validationType.values.comment || ""
                                      }
                                      invalid={
                                        validationType.touched.comment &&
                                        validationType.errors.comment
                                          ? true
                                          : false
                                      }
                                    />
                                    {validationType.touched.comment &&
                                    validationType.errors.comment ? (
                                      <FormFeedback type="invalid">
                                        {validationType.errors.comment}
                                      </FormFeedback>
                                    ) : null}

                                    <Button
                                      type="submit"
                                      color="primary"
                                      className="btn"
                                    >
                                      Add
                                    </Button>
                                  </div>
                                </Col>
                              </Form>
                            </div>
                          ) : (
                            ""
                          )
                        ) : null}
                      </div> */}
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
          <Row>
            <Col>
              <div>
                <Modal isOpen={modal} toggle={toggle}>
                  {/* <ModalHeader toggle={toggle} tag="h4"></ModalHeader> */}
                  {postData
                    ?.filter(item => item.id === commentId)
                    .map((item, index) => (
                      <ModalBody key={index}>
                        <Card className="bg-transparent shadow-none">
                          <CardBody className="p-0">
                            <Row className="">
                              <Col sm={9}>
                                <h5 className="text-uppercase fw-bold">
                                  {item.title}
                                </h5>
                                <p className="text-muted">
                                  {moment(item.created_date).format(
                                    "DD-MM-YYYY , hh:mm A"
                                  )}
                                </p>
                                <span>
                                  <b>Class</b> : {convertStr(item.st_class)}
                                  {/* {JSON.parse(item.st_class).map(
                                    (item, i) => item.label.toUpperCase() + ", "
                                  )} */}
                                </span>
                                <br></br>
                                <span>
                                  <b>Subject</b> :{" "}
                                  {convertStr(item.subject_code)}
                                  {/* {JSON.parse(item.subject_code).map(
                                    (item, i) => item.label + ", "
                                  )} */}
                                </span>
                              </Col>
                              <Col sm={3}>
                                <div className="float-end">
                                  <ul className="nav nav-pills">
                                    <NavItem>
                                      <Button
                                        color="light"
                                        className="btn-sm font-size-18 text-danger"
                                      >
                                        <i
                                          className="mdi mdi-close font-size-18"
                                          id="close"
                                          onClick={() => {
                                            setModal(false)
                                          }}
                                        />
                                      </Button>
                                    </NavItem>
                                  </ul>
                                </div>

                                {/* <button
                             
                          onClick={() => {
                            setModal(false);
                          }}
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button> */}
                              </Col>
                            </Row>
                            <div className="position-relative">
                              {item.media.split(".").at(-1) === "jpg" && (
                                <img
                                  src={`${config.BaseImageUrl}/${item.media}`}
                                  alt=""
                                  className="img-thumbnail my_post"
                                />
                              )}
                              {item.media.split(".").at(-1) === "ico" && (
                                <img
                                  src={`${config.BaseImageUrl}/${item.media}`}
                                  alt=""
                                  className="img-thumbnail my_post"
                                />
                              )}
                              {item.media.split(".").at(-1) === "jpeg" && (
                                <img
                                  src={`${config.BaseImageUrl}/${item.media}`}
                                  alt=""
                                  className="img-thumbnail my_post"
                                />
                              )}
                              {item.media.split(".").at(-1) === "webp" && (
                                <img
                                  src={`${config.BaseImageUrl}/${item.media}`}
                                  alt=""
                                  className="img-thumbnail my_post"
                                />
                              )}
                              {item.media.split(".").at(-1) === "png" && (
                                <img
                                  src={`${config.BaseImageUrl}/${item.media}`}
                                  alt=""
                                  className="img-thumbnail my_post"
                                />
                              )}
                              {item.media.split(".").at(-1) === "pdf" && (
                                <>
                                  <iframe
                                    src={`https://docs.google.com/viewer?url=${config.BaseImageUrl}/${item.media} &embedded=true`}
                                    frameBorder="0"
                                    className="my_post"
                                  ></iframe>
                                  {/* <a href={`https://docs.google.com/viewer?url=${config.BaseImageUrl}/${item.media} &embedded=true`} className="my_post" target="_blank"
                                  rel="noreferrer">
                                  <img
                                  src={`${config.BaseImageUrl}/${item.thumbnail}`}
                                  alt=""
                                  className="img-thumbnail my_post"
                                />
                                  </a> */}
                                </>
                              )}
                            </div>
                            <div className="p-3">
                              <p className={truncate ? "text-truncate" : ""}>
                                {item.description}
                                {item.description?.length >= 80 ? (
                                  <p
                                    className="text-primary cursor"
                                    onClick={() => settruncate(!truncate)}
                                  >
                                    {truncate ? "see more" : "see less"}
                                  </p>
                                ) : (
                                  " "
                                )}
                              </p>
                              <ul className="list-inline">
                                <li className="list-inline-item mr-3">
                                  <Link to="#" className="text-muted">
                                    <i
                                      title="Like"
                                      className="align-middle text-primary me-1"
                                      style={{ fontSize: "22px" }}
                                      onClick={() =>
                                        likeDislike(item.id, "Thumb")
                                      }
                                    >
                                      {" "}
                                      <img src={img1} alt="pre" width={18} />
                                    </i>{" "}
                                    {postIdCount === item.id && thumbCount}
                                    {postIdCount != item.id &&
                                      item?.thumb_likecount}
                                  </Link>
                                </li>
                                <li className="list-inline-item mr-3">
                                  <Link to="#" className="text-muted">
                                    <i
                                      title="Joy"
                                      style={{ fontSize: "22px" }}
                                      className="align-middle text-warning me-1"
                                      onClick={() =>
                                        likeDislike(item.id, "Joy")
                                      }
                                    >
                                      {" "}
                                      <img src={img2} alt="pre" width={18} />
                                      {item.count}
                                    </i>{" "}
                                    {postIdCount === item.id && joyCount}
                                    {postIdCount != item.id &&
                                      item?.joy_likecount}
                                  </Link>
                                </li>
                                <li className="list-inline-item mr-3">
                                  <Link to="#" className="text-muted">
                                    <i
                                      title="Smile"
                                      style={{ fontSize: "22px" }}
                                      className="align-middle text-warning me-1"
                                      onClick={() =>
                                        likeDislike(item.id, "Smile")
                                      }
                                    >
                                      {" "}
                                      <img src={img3} alt="pre" width={18} />
                                      {item.count}
                                    </i>{" "}
                                    {postIdCount === item.id && smileCount}
                                    {postIdCount != item.id &&
                                      item?.smile_likecount}
                                  </Link>
                                </li>
                                {item.is_allow == false ? (
                                  " "
                                ) : (
                                  <li className="list-inline-item mr-3">
                                    <Link
                                      to="#"
                                      className="text-muted"
                                      onClick={() => {
                                        getCommentId(item.id),
                                          setCommentList(3),
                                          handlePostClick()
                                      }}
                                      onDoubleClick={() =>
                                        setCommentId(!commentId)
                                      }
                                    >
                                      <i
                                        className="bx bx-comment-dots align-middle text-primary  me-1"
                                        style={{ fontSize: "22px" }}
                                      ></i>{" "}
                                      {item.comment_count} Comments
                                    </Link>
                                  </li>
                                )}
                              </ul>
                              <div className="mt-4">
                                <div className="mt-5">
                                  {commentId && commentId == item.id ? (
                                    <h5 className="font-size-15">
                                      <i className="bx bx-message-dots text-muted align-middle me-1"></i>
                                      Comments :
                                      {4 < item.post_comment.length ? (
                                        commentList + 1 >=
                                        item.post_comment.length ? (
                                          <Link to="#">
                                            <span
                                              style={{
                                                float: "right",
                                                textDecoration: "underline",
                                              }}
                                              onClick={() => setCommentList(2)}
                                            >
                                              see less...
                                            </span>
                                          </Link>
                                        ) : commentList >= 3 ? (
                                          <Link to="#">
                                            <span
                                              style={{
                                                float: "right",
                                                textDecoration: "underline",
                                              }}
                                              onClick={() =>
                                                setCommentList(
                                                  item.post_comment.length
                                                )
                                              }
                                            >
                                              see more...
                                            </span>
                                          </Link>
                                        ) : null
                                      ) : (
                                        ""
                                      )}
                                    </h5>
                                  ) : (
                                    ""
                                  )}
                                  <div className={!commentId ? "d-none" : ""}>
                                    {item.post_comment &&
                                      item.post_comment?.map((data, index) => (
                                        <>
                                          {index <= commentList ? (
                                            <div
                                              key={data.id}
                                              className="d-flex py-3"
                                            >
                                              {commentId &&
                                              commentId == data.fk_post_id ? (
                                                <div className="avatar-xs me-3">
                                                  <div className="avatar-title rounded-circle bg-light text-primary">
                                                    {data.profile_image ? (
                                                      <img
                                                        src={`${config.BaseImageUrl}/${data.profile_image}`}
                                                        style={{
                                                          width: 40,
                                                          borderRadius: 100,
                                                        }}
                                                      />
                                                    ) : (
                                                      <i className="bx bxs-user"></i>
                                                    )}
                                                  </div>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {commentId &&
                                              commentId == data.fk_post_id ? (
                                                <div className=" flex-grow-1">
                                                  <div className="d-flex">
                                                    <div className="d-flex align-items-center flex-grow-1">
                                                      <span className=" mb-0">
                                                        {data.st_name}
                                                      </span>

                                                      <small className="text-muted px-1">
                                                        <ReactTimeAgo
                                                          date={
                                                            data.comment_date
                                                          }
                                                          locale="en-US"
                                                        />
                                                      </small>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-4 me-auto">
                                                      <div>
                                                        {data.st_name !==
                                                        "Admin" ? (
                                                          <Link
                                                            className=""
                                                            to="#"
                                                            onClick={() => {
                                                              setCount(
                                                                count + 1
                                                              )
                                                            }}
                                                          >
                                                            <i
                                                              id="delete"
                                                              className="bx bxs-message-alt-x text-dark font-size-16 mx-2"
                                                              onClick={() =>
                                                                deleteComment(
                                                                  data.id
                                                                )
                                                              }
                                                            ></i>
                                                            <UncontrolledTooltip
                                                              placement="top"
                                                              target="delete"
                                                            >
                                                              Delete
                                                            </UncontrolledTooltip>
                                                            {data?.student_code ? (
                                                              <>
                                                                {data?.is_block ===
                                                                "True" ? (
                                                                  <>
                                                                    <i
                                                                      id="block"
                                                                      className="px-1 fas fa-ban text-dark font-size-16"
                                                                      onClick={() =>
                                                                        StudentBlockUnBlock(
                                                                          data.fk_post_id,
                                                                          data?.student_code
                                                                          //sarfaraz
                                                                        )
                                                                      }
                                                                    ></i>
                                                                    <UncontrolledTooltip
                                                                      placement="top"
                                                                      target="block"
                                                                    >
                                                                      Block
                                                                    </UncontrolledTooltip>
                                                                  </>
                                                                ) : (
                                                                  <>
                                                                    <i
                                                                      id="unblock"
                                                                      className="px-1 fas fa-unlock text-dark font-size-16"
                                                                      onClick={() =>
                                                                        StudentBlockUnBlock(
                                                                          data.fk_post_id,
                                                                          data?.student_code
                                                                          //sarfaraz
                                                                        )
                                                                      }
                                                                    ></i>
                                                                    <UncontrolledTooltip
                                                                      placement="top"
                                                                      target="unblock"
                                                                    >
                                                                      Unblock
                                                                    </UncontrolledTooltip>
                                                                  </>
                                                                )}
                                                              </>
                                                            ) : null}
                                                          </Link>
                                                        ) : (
                                                          name === "Admin" && (
                                                            <Link
                                                              className=""
                                                              to="#"
                                                              onClick={() => {
                                                                setCount(
                                                                  count + 1
                                                                )
                                                              }}
                                                            >
                                                              <i
                                                                className="bx bxs-message-alt-x text-dark font-size-16"
                                                                onClick={() =>
                                                                  deleteComment(
                                                                    data.id
                                                                  )
                                                                }
                                                              ></i>
                                                            </Link>
                                                          )
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <p className="text-muted">
                                                    {data.comment}
                                                  </p>

                                                  {data?.reply?.map(
                                                    (r, index) => {
                                                      console.log(r)
                                                      return (
                                                        <div
                                                          className="d-flex pt-3"
                                                          key={index}
                                                        >
                                                          <div className="avatar-xs me-3">
                                                            <div className="avatar-title rounded-circle bg-light text-primary">
                                                              {r.profile_image ? (
                                                                <img
                                                                  src={`${r.profile_image}`}
                                                                  // src={`${config.BaseImageUrl}/${r.profile_image}`}
                                                                  style={{
                                                                    width: 40,
                                                                    borderRadius: 100,
                                                                  }}
                                                                />
                                                              ) : (
                                                                <i className="bx bxs-user"></i>
                                                              )}
                                                            </div>
                                                          </div>
                                                          <div className="flex-grow-1">
                                                            <span className="font-size-12 mb-1">
                                                              {r.teacher_name}
                                                            </span>
                                                            <small className="text-muted float-end">
                                                              <ReactTimeAgo
                                                                date={
                                                                  r.reply_date
                                                                }
                                                                locale="en-US"
                                                              />
                                                              <br />
                                                              {name ===
                                                              "Admin" ? null : (
                                                                <a
                                                                  className="text-primary float-end"
                                                                  onClick={() =>
                                                                    setEditReplay(
                                                                      !Editreplay
                                                                    )
                                                                  }
                                                                >
                                                                  Edit Reply
                                                                </a>
                                                              )}
                                                            </small>
                                                            <p className="text-muted d-flex">
                                                              {r.reply}
                                                            </p>
                                                            {Editreplay && (
                                                              <div className="hstack">
                                                                <Input
                                                                  className="form-control-auto"
                                                                  name="reply"
                                                                  type="text"
                                                                  onChange={e =>
                                                                    setEditReply(
                                                                      e.target
                                                                        .value
                                                                    )
                                                                  }
                                                                  value={
                                                                    editReply
                                                                  }
                                                                />
                                                                <Button
                                                                  type="submit"
                                                                  color="primary"
                                                                  className="btn"
                                                                  onClick={() => {
                                                                    EditCommentReplyApi(
                                                                      r.id,
                                                                      editReply
                                                                    )
                                                                    setEditReplay(
                                                                      !Editreplay
                                                                    )
                                                                  }}
                                                                >
                                                                  Reply
                                                                </Button>
                                                              </div>
                                                            )}
                                                          </div>
                                                        </div>
                                                      )
                                                    }
                                                  )}

                                                  <span>
                                                    {data?.reply?.length ===
                                                      0 && name !== "Admin" ? (
                                                      <Link
                                                        to="#"
                                                        className="text-success"
                                                        onClick={() => {
                                                          setReplay(!replay)
                                                          setReplayCommId(
                                                            data.id
                                                          )
                                                          setReplytxtbox(
                                                            data.fk_post_id
                                                          )
                                                        }}
                                                      >
                                                        <i className="mdi mdi-reply"></i>
                                                        Reply
                                                      </Link>
                                                    ) : (
                                                      ""
                                                    )}
                                                  </span>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </>
                                      ))}
                                  </div>
                                </div>
                                {name !== "Admin" ? (
                                  replay && replytxtbox === item.id ? (
                                    <div className="flex-grow-1 fixed">
                                      <Form
                                        onSubmit={e => {
                                          e.preventDefault()
                                          validation.handleSubmit()
                                          return false
                                        }}
                                      >
                                        <Col sm={10} className="m-auto">
                                          <div className="hstack">
                                            <Input
                                              className="form-control-auto"
                                              name="reply"
                                              type="text"
                                              onChange={validation.handleChange}
                                              value={validation.values.reply}
                                              invalid={
                                                validation.touched.reply &&
                                                validation.errors.reply
                                                  ? true
                                                  : false
                                              }
                                            />
                                            {validation.touched.reply &&
                                            validation.errors.reply ? (
                                              <FormFeedback type="invalid">
                                                {validation.errors.reply}
                                              </FormFeedback>
                                            ) : null}

                                            <Button
                                              type="submit"
                                              color="primary"
                                              className="btn"
                                            >
                                              Reply
                                            </Button>
                                          </div>
                                        </Col>
                                      </Form>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : null}
                                {name == "Admin" ? (
                                  commentId && commentId == item.id ? (
                                    <div className="flex-grow-1">
                                      <Form
                                        onSubmit={e => {
                                          e.preventDefault()
                                          validationType.handleSubmit()
                                        }}
                                      >
                                        <Col lg={11}>
                                          <div className="hstack">
                                            <Input
                                              className="form-control-auto"
                                              name="comment"
                                              type="text"
                                              onChange={handleCommentChange}
                                              onClick={() => onPostId(item.id)}
                                              // onBlur={validationType.handleBlur}
                                              value={
                                                validationType.values.comment ||
                                                ""
                                              }
                                              invalid={
                                                validationType.touched
                                                  .comment &&
                                                validationType.errors.comment
                                                  ? true
                                                  : false
                                              }
                                            />
                                            {validationType.touched.comment &&
                                            validationType.errors.comment ? (
                                              <FormFeedback type="invalid">
                                                {validationType.errors.comment}
                                              </FormFeedback>
                                            ) : null}

                                            <Button
                                              type="submit"
                                              color="primary"
                                              className="btn"
                                            >
                                              Add
                                            </Button>
                                          </div>
                                        </Col>
                                      </Form>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : null}
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </ModalBody>
                    ))}
                </Modal>
              </div>
            </Col>
          </Row>
          <Row>
            <Modal isOpen={modal_large} toggle={imagetoggle} size="lg">
              {/* <ModalHeader toggle={imagetoggle} tag="h4" className="bg-dark"></ModalHeader> */}
              {postData
                ?.filter(item => item.id === commentId)
                .map((item, index) => (
                  <ModalBody
                    key={index}
                    className="img_height d-flex justify-content-center align-items-center "
                  >
                    <div className="position-relative">
                      {item.media.split(".").at(-1) === "jpg" && (
                        <img
                          src={`${config.BaseImageUrl}/${item.media}`}
                          alt=""
                          className=""
                        />
                      )}
                      {item.media.split(".").at(-1) === "ico" && (
                        <img
                          src={`${config.BaseImageUrl}/${item.media}`}
                          alt=""
                          className=""
                        />
                      )}
                      {item.media.split(".").at(-1) === "jpeg" && (
                        <img
                          src={`${config.BaseImageUrl}/${item.media}`}
                          alt=""
                          className=""
                        />
                      )}
                      {item.media.split(".").at(-1) === "webp" && (
                        <img
                          src={`${config.BaseImageUrl}/${item.media}`}
                          alt=""
                          className=""
                        />
                      )}
                      {item.media.split(".").at(-1) === "png" && (
                        <img
                          src={`${config.BaseImageUrl}/${item.media}`}
                          alt=""
                          className=""
                        />
                      )}
                      {item.media.split(".").at(-1) === "pdf" && (
                        <>
                          <iframe
                            src={`https://docs.google.com/viewer?url=${config.BaseImageUrl}/${item.media} &embedded=true`}
                            frameBorder="0"
                            className="my_post"
                          ></iframe>
                        </>
                      )}
                    </div>
                  </ModalBody>
                ))}
            </Modal>
          </Row>
        </TabContent>
        <div className="col-12 mt-5">
          <nav style={{ backgroundColor: "transparent", borderRadius: 10 }}>
            {postData?.length === 0 ? (
              " "
            ) : (
              <ul className="pagination justify-content-center">
                {Page && (
                  <Pagination
                    activePage={CurrentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={Page}
                    // totalItemsCount={
                    //   filteredProducts && productCount ? productCount : 0
                    // }
                    hideFirstLastPages={true}
                    onChange={e => setCurrentPage(e)}
                    nextPageText="Next"
                    prevPageText="Previous"
                    lastPageText="Last"
                    firstPageText="1st"
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="active"
                    activeLinkClass="active"
                    hideDisabled={true}
                  />
                )}
              </ul>
            )}
          </nav>
        </div>
      </Col>
    </React.Fragment>
  )
}

export default PostList
