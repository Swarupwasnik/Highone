import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import "react-perfect-scrollbar/dist/css/styles.css"
import { GetAllTeacher } from "apis/ChatsApi"
import { Link } from "react-router-dom"
import PerfectScrollbar from "react-perfect-scrollbar"
import avatar1 from "../../assets/images/users/avatar-1.jpg"
import classnames from "classnames"
import {
  UncontrolledTooltip,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Button,
  Card,
  Col,
  Container,
  Row,
  InputGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Label,
} from "reactstrap"
import Swal from "sweetalert2"
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import Loading from "components/Loading"
import { useFormik } from "formik"
import * as Yup from "yup"
import { storage } from "./firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en.json"
import ru from "javascript-time-ago/locale/ru.json"
import ReactTimeAgo from "react-time-ago"

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const firebaseConfig = {
  apiKey: "AIzaSyAL7y_Uzk0ZHtPxr11UO0EzYSq0stMuTHk",
  authDomain: "sps-project-cee0e.firebaseapp.com",
  projectId: "sps-project-cee0e",
  storageBucket: "sps-project-cee0e.appspot.com",
  messagingSenderId: "882092014287",
  appId: "1:882092014287:web:ab601fd016fd7a903bd5ba",
  measurementId: "G-QMZMKEMNGT",
}

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

const Chat = () => {
  const path = window?.location.pathname.split("/chat/")[1]
  const [userData, setUserData] = useState({})

  document.title = "Chat"
  //Chat Room
  const [loading, setLoading] = useState(false)
  const [activeTab, setactiveTab] = useState("1")
  const [active, setactive] = useState("Active")
  const [AllUser, setAllUser] = useState([])
  const myuser = JSON.parse(localStorage.getItem("User"))
  const [search, setSearch] = useState("")
  const [FilterData, setFilterData] = useState([])
  const [AdminData, setAdminData] = useState([])

  const handlesearch = e => {
    setSearch(e.target.value)
    searchFilter(e.target.value)
  }

  const GetUsers = async () => {
    setLoading(true)
    await GetAllTeacher.GetAllTeacher()
      .then(res => {
        setAllUser(res.data.teacher)
        setAdminData(res.data.admin)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    GetUsers()
  }, [userData])

  const searchFilter = text => {
    if (text) {
      const newData = AllUser.filter(item => {
        const t_name = item.t_name ? item.t_name : "".toUpperCase()
        const textData = text.toUpperCase()
        return t_name.indexOf(textData) > -1
      })
      setFilterData(newData)
      console.log(newData, "Search")
      setSearch(text)
    } else {
      setFilterData(AllUser)
      setSearch(text)
    }
  }

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }

  // Chatting
  const AdminUser = JSON.parse(localStorage.getItem("Admin"))

  const [messages, setMessages] = useState([])
  const [messageBox, setMessageBox] = useState(null)
  const [search_Menu, setsearch_Menu] = useState(false)

  const [senderCode, setSenderCode] = useState("")
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")

  const [receiverCode, setReceiverCode] = useState(1)
  const [receiverName, setReceiverName] = useState("")
  const [receiverEmail, setReceiverEmail] = useState("")
  const [message, setMessage] = useState("")

  const GetUser = async () => {
    setLoading(true)
    const data = {
      t_code: path,
    }
    await GetAllTeacher.GetSingleUser(data)
      .then(({ data }) => {
        setUserData(data.data[0])
        setReceiverCode(data.data[0].t_code)
        setReceiverName(data.data[0].t_name)
        setReceiverEmail(data.data[0].t_email)
        // console.log(userData)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    GetUser()
  }, [path])

  useEffect(() => {
    if (AdminUser && AdminUser) {
      setSenderCode(AdminUser?.id)
      setSenderName(AdminUser?.name)
      setSenderEmail(AdminUser?.login_id)
    } else {
      setSenderCode(myuser?.payload?.t_code)
      setSenderName(myuser?.payload?.t_name)
      setSenderEmail(myuser?.payload?.t_email)
    }
  }, [])

  const toggleSearch = () => {
    setsearch_Menu(!search_Menu)
  }

  const onKeyPress = e => {
    const { key, value } = e
    if (key === "Enter") {
      setMessage(value)
      onSend()
    }
  }

  async function getChat() {
    await db
      .collection("Chatting")
      .where("receiverCode", "==", receiverCode)
      .where("senderCode", "==", senderCode)
      .onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          setMessages(doc?.data().messages)
        })
      })
    if (messages.length === 0) {
      await db
        .collection("Chatting")
        .where("receiverCode", "==", senderCode)
        .where("senderCode", "==", receiverCode)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            setMessages(doc?.data().messages)
          })
        })
    }
  }
  useEffect(() => {
    getChat()
    setLoading(false)
  }, [userData, AdminData])

  const [file, setFile] = useState(null)
  const [percent, setPercent] = useState(0)
  const [getUrl, setGetUrl] = useState(null)

  const FileRead = async event => {
    const file = event.target.files[0]
    if (file.size <= 524288) {
      const FileUpload = async () => {
        const storageRef = ref(storage, `/files/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on(
          "state_changed",
          snapshot => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setPercent(percent)
            let timerInterval = percent
            Swal.fire({
              title: "Image Uploading",
              html: "Waiting time <b></b>",
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector("b")
                timerInterval = setInterval(() => {
                  b.textContent = Swal.getTimerLeft()
                }, 100)
              },
              willClose: () => {
                clearInterval(timerInterval)
              },
            }).then(result => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer")
              }
            })
          },
          err => console.log(err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(url => {
              setGetUrl(url)
              setFile(null)
            })
          }
        )
      }
      FileUpload()
    } else {
      Swal.fire({
        text: "Please select less than 500kb image",
        icon: "warning",
        imageAlt: "warning image",
      }).then(e => {
        setFile(null)
      })
    }
  }
  // useEffect(() => {}, [file])

  const onSend = async () => {
    const today = new Date()
    const date =
      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    const dateTime = date + " " + time

    const messageDate = new Date().toLocaleDateString("en-GB")
    const messageTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })

    const chatMessages1 = await db
      .collection("Chatting")
      .where("senderCode", "==", senderCode)
      .where("receiverCode", "==", receiverCode)

    const chatMessages2 = await db
      .collection("Chatting")
      .where("senderCode", "==", receiverCode)
      .where("receiverCode", "==", senderCode)

    const messageData = {
      date: messageDate,
      file_type: getUrl ? "image" : "text",
      media: getUrl,
      message: message,
      senderCode: senderCode,
      sender_email: senderEmail,
      receiverCode: receiverCode,
      time: messageTime,
      sender: senderName,
    }

    let chat_messages1_obj = await chatMessages1.get()

    let chat_messages2_obj = await chatMessages2.get()

    if (chat_messages1_obj.empty && chat_messages2_obj.empty) {
      await db
        .collection("Chatting")
        .add({
          date_time: dateTime,
          receiverCode: receiverCode,
          senderCode: senderCode,
          messages: [messageData],
          receiver: receiverName,
          receiver_email: receiverEmail,
          receiver_seen: 1,
          created: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef)
        })
        .catch(function (error) {
          console.error("Error adding document: ", error)
        })
    } else {
      const increment = firebase.firestore.FieldValue.increment(1)
      let docId = ""
      let ref_1 = chat_messages1_obj
      let ref_2 = chat_messages2_obj

      if (ref_1.empty) {
        const docRefId = ref_2.docs[0].id

        await db
          .collection("Chatting")
          .doc(docRefId)
          .update({
            date_time: dateTime,
            messages: firebase.firestore.FieldValue.arrayUnion(messageData),
            sender_seen: increment,
            created: firebase.firestore.FieldValue.serverTimestamp(),
          })
      } else {
        const docRefId = ref_1.docs[0].id

        await db
          .collection("Chatting")
          .doc(docRefId)
          .update({
            date_time: dateTime,
            messages: firebase.firestore.FieldValue.arrayUnion(messageData),
            receiver_seen: increment,
            created: firebase.firestore.FieldValue.serverTimestamp(),
          })
      }
    }

    setMessage("")
    setGetUrl(null)
    setPercent(0)
  }

  const StatusChange = () => {
    document.addEventListener("visibilitychange", async event => {
      if (document.visibilityState == "visible") {
        let body = {
          t_code: myuser === "Admin" ? "admin" : myuser?.payload?.t_code,
          online_status: "Online",
        }
        const response = await GetAllTeacher.UpdateOnlieOfflineStatus(
          body
        ).then(res => {
          console.log(res.data)
        })
      } else {
        let body = {
          t_code: myuser === "Admin" ? "admin" : myuser?.payload?.t_code,
          online_status: "Offline",
        }
        const response = await GetAllTeacher.UpdateOnlieOfflineStatus(
          body
        ).then(res => {
          console.log(res.data)
        })
      }
    })
  }
  useEffect(() => {
    StatusChange()
    GetUsers()
    // return StatusChange()
  }, [])

  return (
    <React.Fragment>
      <Container fluid className="mt-5 pt-5">
        <Row>
          <Col lg="12">
            <div className="d-lg-flex">
              {/* <ChatRoom /> */}
              <div className="chat-leftsidebar me-lg-4">
                <div className="search-box chat-search-box pb-3">
                  <div className="position-relative">
                    <Input
                      value={search || ""}
                      onChange={handlesearch}
                      id="search-user"
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                    />
                    <i className="bx bx-search-alt search-icon" />
                  </div>
                </div>

                <div className="">
                  <div className="chat-leftsidebar-nav">
                    <Nav pills justified>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "1",
                          })}
                          onClick={() => {
                            toggleTab("1")
                          }}
                        >
                          <i className="bx bx-chat font-size-20 d-sm-none" />
                          <span className="d-none d-sm-block">Chat</span>
                        </NavLink>
                      </NavItem>

                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "3",
                          })}
                          onClick={() => {
                            toggleTab("3")
                          }}
                        >
                          <i className="bx bx-book-content font-size-20 d-sm-none" />
                          <span className="d-none d-sm-block">Contacts</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <h5 className="font-size-14 my-3">Chats</h5>
                        <div>
                          <PerfectScrollbar style={{ height: "70vh" }}>
                            <div className="">
                              {myuser === "Admin"
                                ? null
                                : AdminData.map(user => (
                                    <Link
                                      to={`/chat/${user.id}`}
                                      key={user.id}
                                      onClick={() => {
                                        // path === user.id
                                        //   ? console.log("No change")
                                        //   : setMessage(""),
                                        setMessages([]),
                                          setUserData(AdminData),
                                          console.log(user.id == path)
                                      }}
                                    >
                                      <div className="d-flex py-2 border-bottom">
                                        <div className="align-self-center me-3">
                                          <img
                                            src={
                                              user.profile_pic_url === ""
                                                ? avatar1
                                                : user.profile_pic_url
                                            }
                                            className="avatar-xs rounded-circle"
                                            alt=""
                                          />
                                        </div>
                                        <div className="flex-grow-1">
                                          <h5 className="font-size-15 mt-0 mb-1">
                                            {user.name
                                              .toLowerCase()
                                              .charAt(0)
                                              .toUpperCase() +
                                              user.name.toLowerCase().slice(1)}
                                          </h5>
                                          <p className="text-muted mb-0">
                                            <i
                                              className={
                                                user.online_status === "Online"
                                                  ? "mdi mdi-circle text-success align-middle me-2"
                                                  : "mdi mdi-circle text-secondary align-middle me-2"
                                              }
                                            />
                                            {user.online_status}
                                          </p>
                                        </div>
                                        <div className="font-size-11">
                                          {user?.online_datetime === "" ||
                                          null ? null : (
                                            <ReactTimeAgo
                                              date={user.online_datetime}
                                              locale="en-US"
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                            </div>
                          </PerfectScrollbar>
                        </div>
                      </TabPane>
                      <TabPane tabId="3">
                        <h5 className="font-size-14 my-3">Contact</h5>
                        <div>
                          <PerfectScrollbar style={{ height: "70vh" }}>
                            <div className="">
                              {FilterData.length === 0
                                ? AllUser &&
                                  AllUser.map(user =>
                                    user?.t_code ===
                                    myuser?.payload?.t_code ? null : (
                                      <Link
                                        to={`/chat/${user.t_code}`}
                                        key={user.t_code}
                                        onClick={() => {
                                          path === user.t_code
                                            ? console.log("No change")
                                            : setMessages([]),
                                            setactive(user.online_status)
                                        }}
                                      >
                                        <div className="d-flex py-2 border-bottom">
                                          <div className="align-self-center me-3">
                                            <img
                                              src={
                                                user.profile_pic_url === ""
                                                  ? avatar1
                                                  : user.profile_pic_url
                                              }
                                              className="avatar-xs rounded-circle"
                                              alt=""
                                            />
                                          </div>
                                          <div className="flex-grow-1">
                                            <h5 className="font-size-15 mt-0 mb-1">
                                              {user.t_name
                                                .toLowerCase()
                                                .charAt(0)
                                                .toUpperCase() +
                                                user.t_name
                                                  .toLowerCase()
                                                  .slice(1)}
                                            </h5>
                                            <p className="text-muted mb-0">
                                              <i
                                                className={
                                                  user.online_status ===
                                                  "Online"
                                                    ? "mdi mdi-circle text-success align-middle me-2"
                                                    : "mdi mdi-circle text-secondary align-middle me-2"
                                                }
                                              />
                                              {user.online_status}
                                            </p>
                                          </div>
                                          <div className="font-size-11">
                                            {user?.online_datetime === "" ||
                                            null ? null : (
                                              <ReactTimeAgo
                                                date={user.online_datetime}
                                                locale="en-US"
                                              />
                                            )}
                                          </div>
                                        </div>
                                      </Link>
                                    )
                                  )
                                : FilterData.map(user => (
                                    <Link
                                      to={`/chat/${user.t_code}`}
                                      key={user.t_code}
                                      onClick={() => {
                                        path === user.t_code
                                          ? console.log("No change")
                                          : setMessages([])
                                      }}
                                    >
                                      <div className="d-flex py-2 border-bottom">
                                        <div className="align-self-center me-3">
                                          <img
                                            src={
                                              user.profile_pic_url === ""
                                                ? avatar1
                                                : user.profile_pic_url
                                            }
                                            className="avatar-xs rounded-circle"
                                            alt=""
                                          />
                                        </div>
                                        <div className="flex-grow-1">
                                          <h5 className="font-size-15 mt-0 mb-1">
                                            {user.t_name
                                              .toLowerCase()
                                              .charAt(0)
                                              .toUpperCase() +
                                              user.t_name
                                                .toLowerCase()
                                                .slice(1)}
                                          </h5>
                                          <p className="text-muted mb-0">
                                            <i
                                              className={
                                                user.online_status === "Online"
                                                  ? "mdi mdi-circle text-success align-middle me-2"
                                                  : "mdi mdi-circle text-secondary align-middle me-2"
                                              }
                                            />
                                            {user.online_status}
                                          </p>
                                        </div>
                                        <div className="font-size-11">
                                          {user?.online_datetime === "" ||
                                          null ? null : (
                                            <ReactTimeAgo
                                              date={user.online_datetime}
                                              locale="en-US"
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                            </div>
                          </PerfectScrollbar>
                        </div>
                      </TabPane>
                    </TabContent>
                  </div>
                </div>
              </div>

              <div className="w-100 user-chat">
                <Card>
                  {/* Chattting */}
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      <div className="p-4 border-bottom ">
                        <Row>
                          <Col md="4" xs="9">
                            <h5 className="font-size-15 mb-1">
                              {userData?.t_name
                                ? userData.t_name
                                : userData.length === undefined
                                ? null
                                : "Admin"}
                            </h5>
                            {userData?.t_name ? (
                              <p className="text-muted mb-0">
                                <i
                                  className={
                                    active === "Online"
                                      ? "mdi mdi-circle text-success align-middle me-2"
                                      : active === "intermediate"
                                      ? "mdi mdi-circle text-warning align-middle me-1"
                                      : "mdi mdi-circle align-middle me-1"
                                  }
                                />
                                {active}
                              </p>
                            ) : userData.length === undefined ? null : (
                              <p className="text-muted mb-0">
                                <i
                                  className={
                                    active === "Online"
                                      ? "mdi mdi-circle text-success align-middle me-2"
                                      : active === "intermediate"
                                      ? "mdi mdi-circle text-warning align-middle me-1"
                                      : "mdi mdi-circle align-middle me-1"
                                  }
                                />
                                {active}
                              </p>
                            )}
                          </Col>
                          <Col md="8" xs="3">
                            <ul className="list-inline user-chat-nav text-end mb-0">
                              {/* <li className="list-inline-item d-none d-sm-inline-block">
                                <Dropdown
                                  className="me-1"
                                  isOpen={search_Menu}
                                  toggle={toggleSearch}
                                >
                                  <DropdownToggle
                                    className="btn nav-btn"
                                    tag="a"
                                  >
                                    <i className="bx bx-search-alt-2" />
                                  </DropdownToggle>
                                  <DropdownMenu className="dropdown-menu-md">
                                    <Form className="p-3">
                                      <FormGroup className="m-0">
                                        <InputGroup>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search ..."
                                            aria-label="Recipient's username"
                                          />
                                          <Button color="primary" type="submit">
                                            <i className="mdi mdi-magnify" />
                                          </Button>
                                        </InputGroup>
                                      </FormGroup>
                                    </Form>
                                  </DropdownMenu>
                                </Dropdown>
                              </li> */}
                            </ul>
                          </Col>
                        </Row>
                      </div>
                      {/*  */}
                      <div>
                        <div className="chat-conversation">
                          <ul className="list-unstyled">
                            <PerfectScrollbar
                              style={{ height: "535px" }}
                              containerRef={ref => setMessageBox(ref)}
                            >
                              {/* <li><div className="chat-day-title"><span className="title">Today</span></div></li> */}
                              {messages.length > 0 ? (
                                messages.map(msg => (
                                  <div key={msg.time}>
                                    {msg.senderCode === senderCode ? (
                                      <div className="outgoing-chats">
                                        <div className="outgoing-chats-img">
                                          <img
                                            src={
                                              myuser?.payload?.profile_pic_url
                                            }
                                            style={{
                                              width: 50,
                                              borderRadius: 100,
                                              background: "lightgray",
                                            }}
                                          />
                                        </div>
                                        <div className="outgoing-msg">
                                          <div className="outgoing-chats-msg">
                                            {msg.message === "" ? null : (
                                              <p className="multi-msg">
                                                {msg.message}
                                              </p>
                                            )}
                                            <span className="time">
                                              {msg.time}
                                            </span>
                                            <img
                                              src={msg.media}
                                              style={{
                                                width: 230,
                                                float: "right",
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ) : msg.receiverCode === senderCode ? (
                                      <div className="received-chats">
                                        <div className="received-chats-img">
                                          <img
                                            src={userData?.profile_pic_url}
                                            style={{
                                              width: 50,
                                              borderRadius: 100,
                                              background: "lightgray",
                                            }}
                                          />
                                        </div>
                                        <div className="received-msg">
                                          <div className="received-msg-inbox">
                                            {msg.message === "" ? null : (
                                              <p className="multi-msg">
                                                {msg.message}
                                              </p>
                                            )}
                                            <span className="time">
                                              {msg.time}
                                            </span>
                                          </div>
                                          <img
                                            src={msg.media}
                                            style={{
                                              width: 230,
                                              flex: "left",
                                              margin: 20,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : null}
                                    {/* <p>{percent} "% done"</p> */}
                                  </div>
                                ))
                              ) : (
                                <h3 className="text-center">No Messages</h3>
                              )}
                            </PerfectScrollbar>
                            {getUrl ? (
                              <img
                                src={getUrl}
                                style={{
                                  width: 230,
                                  boxShadow: `rgb(0 0 0 / 25%) 0px 5px 5px 2px`,
                                  borderRadius: 10,
                                  justifySelf: "flex-end",
                                }}
                              />
                            ) : null}
                          </ul>
                        </div>

                        <div className="chat-input-section">
                          <Row>
                            <Col>
                              <div className="position-relative">
                                <input
                                  type="text"
                                  value={message}
                                  onKeyPress={onKeyPress}
                                  onChange={e => setMessage(e.target.value)}
                                  className="form-control chat-input"
                                  placeholder="Enter Message..."
                                />
                                <div className="chat-input-links">
                                  <ul className="list-inline mb-0">
                                    <li className="list-inline-item"></li>
                                    <Label
                                      htmlFor="uploadfile"
                                      className="upload_label"
                                    >
                                      <li className="list-inline-item">
                                        {/* <Link to="#"> */}
                                        <i
                                          className="mdi mdi-file-image-outline me-1 font-size-24"
                                          id="Imagetooltip"
                                        />
                                        <UncontrolledTooltip
                                          placement="top"
                                          target="Imagetooltip"
                                        >
                                          Images
                                        </UncontrolledTooltip>
                                        {/* </Link> */}
                                      </li>
                                    </Label>
                                    <Input
                                      name="result"
                                      type="file"
                                      className="form-control hidden_upload"
                                      id="uploadfile"
                                      accept="image/*"
                                      onChange={e => {
                                        FileRead(e)
                                        setFile(e.target.files[0])
                                        console.log(e.target.files[0])
                                      }}
                                    />

                                    {/* <li
                                      className="list-inline-item"
                                      onClick={() => alert("Files")}
                                    >
                                      <Link to="#">
                                        <i
                                          className="mdi mdi-file-document-outline"
                                          id="Filetooltip"
                                        />
                                        <UncontrolledTooltip
                                          placement="top"
                                          target="Filetooltip"
                                        >
                                          Add Files
                                        </UncontrolledTooltip>
                                      </Link>
                                    </li> */}
                                  </ul>
                                </div>
                              </div>
                            </Col>
                            <Col className="col-auto">
                              <Button
                                type="button"
                                color="primary"
                                onClick={onSend}
                                className="btn btn-primary btn-rounded chat-send"
                                disabled={message || getUrl ? false : true}
                              >
                                <span className="d-none d-sm-inline-block me-2">
                                  Send
                                </span>{" "}
                                <i className="mdi mdi-send" />
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

Chat.propTypes = {
  chats: PropTypes.array,
  groups: PropTypes.array,
  contacts: PropTypes.array,
  messages: PropTypes.array,
  onGetChats: PropTypes.func,
  onGetGroups: PropTypes.func,
  onGetContacts: PropTypes.func,
  onGetMessages: PropTypes.func,
  onAddMessage: PropTypes.func,
}

export default Chat
