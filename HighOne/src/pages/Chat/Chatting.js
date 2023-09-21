import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Col,
  Row,
  UncontrolledTooltip,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
} from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import { useDispatch } from "react-redux"
import { GetAllTeacher } from "apis/ChatsApi"

import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

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

const Chatting = props => {
  // const path = window?.location.pathname.split("/chat/")[1]
  // console.log(props.userData)

  const myuser = JSON.parse(localStorage.getItem("User"))
  const AdminUser = JSON.parse(localStorage.getItem("Admin"))
  const [userData, setUserData] = useState({})

  const [messages, setMessages] = useState([])
  const [messageBox, setMessageBox] = useState(null)
  const [search_Menu, setsearch_Menu] = useState(false)

  // const [senderCode, setSenderCode] = useState(myuser?.payload?.t_code)
  // const [senderName, setSenderName] = useState(myuser?.payload?.t_name)
  // const [senderEmail, setSenderEmail] = useState(myuser?.payload?.t_email)

  const [senderCode, setSenderCode] = useState("")
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")

  const [receiverCode, setReceiverCode] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [receiverEmail, setReceiverEmail] = useState("")
  const [message, setMessage] = useState("")

  const GetUser = async () => {
    const data = {
      t_code: props.userData.t_code,
    }
    await GetAllTeacher.GetSingleUser(data)
      .then(({ data }) => {
        setUserData(data.data[0])
        setReceiverCode(data.data[0].t_code)
        setReceiverName(data.data[0].t_name)
        setReceiverEmail(data.data[0].t_email)
      })
      .catch(err => {
        console.log(err)
      })
  }

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

  // console.log(userData)
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

  useEffect(() => {
    GetUser()
    // setMessages([])
    async function getChat() {
      await db
        .collection("Chatting")
        .where("receiverCode", "==", receiverCode)
        .where("senderCode", "==", senderCode)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // console.log(doc.data()['message'][0]["message"], "Data mil gya")
            // console.log(doc.data()['message'].map(({message})=> message ) , "Data mil gya")
            setMessages(doc?.data().messages)
            // console.log(doc?.data().messages)

            // doc.data()["messages"].forEach(function (message) {
            // console.log([message], "Data mil gya")
            // setMessages(message)
            // })
          })
        })
    }
    getChat()
    // ShowMessages()
  }, [props.id])

  const onSend = async () => {
    const today = new Date()
    const date =
      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    const dateTime = date + " " + time

    const messageDate = new Date().toLocaleDateString("en-GB")
    const messageTime = new Date().toLocaleTimeString()

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
      file_type: "text",
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
      console.log(
        dateTime,
        receiverCode,
        senderCode,
        messageData,
        receiverName,
        receiverEmail
      )

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
            messages: firebase.firestore.FieldValue.arrayUnion(messageData),
            receiver_seen: increment,
            created: firebase.firestore.FieldValue.serverTimestamp(),
          })
      }
    }

    setMessage("")
  }

  async function ShowMessages() {
    // console.log(receiverCode, senderCode)

    const ref_1 = await db
      .collection("Chatting")
      .where("senderCode", "==", senderCode)
      .where("receiverCode", "==", receiverCode)
      .get()

    const ref_2 = await db
      .collection("Chatting")
      .where("senderCode", "==", receiverCode)
      .where("receiverCode", "==", senderCode)
      .get()

    if (ref_1.empty) {
      await db
        .collection("Chatting")
        .where("senderCode", "==", receiverCode)
        .where("receiverCode", "==", senderCode)
        .onSnapshot(function (querySnapshot) {
          includeMetadataChanges: true
          querySnapshot.forEach(function (doc) {
            doc.data()["messages"].forEach(function (messages) {
              if (messages["senderCode"] == receiverCode) {
                console.log(messages["message"], "Left")
              } else if (messages["senderCode"] == senderCode) {
                console.log(messages["message"], "Right")
              }
            })
          })
        })
    } else {
      await db
        .collection("Chatting")
        .where("senderCode", "==", senderCode)
        .where("receiverCode", "==", receiverCode)
        .onSnapshot(function (querySnapshot) {
          includeMetadataChanges: true
          querySnapshot.forEach(function (doc) {
            doc.data()["messages"].forEach(function (messages) {
              if (messages["senderCode"] == senderCode) {
                console.log(messages["message"], "msg Right")
              } else if (messages["senderCode"] == receiverCode) {
                console.log(messages["message"], "msg Left")
              }
            })
          })
        })
    }
  }

  return (
    <>
      <div className="p-4 border-bottom ">
        <Row>
          <Col md="4" xs="9">
            <h5 className="font-size-15 mb-1">{props.userData?.t_name}</h5>
            <p className="text-muted mb-0">
              <i
                className={
                  props.active === "Active Now"
                    ? "mdi mdi-circle text-success align-middle me-2"
                    : props.active === "intermediate"
                    ? "mdi mdi-circle text-warning align-middle me-1"
                    : "mdi mdi-circle align-middle me-1"
                }
              />
              {props.active}
            </p>
          </Col>
          <Col md="8" xs="3">
            <ul className="list-inline user-chat-nav text-end mb-0">
              <li className="list-inline-item d-none d-sm-inline-block">
                <Dropdown
                  className="me-1"
                  isOpen={search_Menu}
                  toggle={toggleSearch}
                >
                  <DropdownToggle className="btn nav-btn" tag="a">
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
              </li>
            </ul>
          </Col>
        </Row>
      </div>
      {/*  */}
      <div>
        <div className="chat-conversation p-3">
          <ul className="list-unstyled">
            <PerfectScrollbar
              style={{ height: "470px" }}
              containerRef={ref => setMessageBox(ref)}
            >
              {/* <li>
                <div className="chat-day-title">
                  <span className="title">Today</span>
                </div>
              </li> */}

              {!messages ? (
                <p>Loading....</p>
              ) : (
                messages.map(msg => {
                  console.log(msg.senderCode === receiverCode)
                  return (
                    <div key={msg.time}>
                      {msg.senderCode === senderCode ? (
                        <div className="outgoing-chats">
                          <div className="outgoing-chats-img">
                            <img
                              src={myuser?.payload?.profile_pic_url}
                              style={{
                                width: 50,
                                borderRadius: 100,
                                background: "red",
                              }}
                            />
                          </div>
                          <div className="outgoing-msg">
                            <div className="outgoing-chats-msg">
                              <p className="multi-msg">{msg.message}</p>
                              <span className="time">{msg.time}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="received-chats">
                          <div className="received-chats-img">
                            <img
                              src={props.userData?.profile_pic_url}
                              style={{
                                width: 50,
                                borderRadius: 100,
                                background: "red",
                              }}
                            />
                          </div>
                          <div className="received-msg">
                            <div className="received-msg-inbox">
                              <p>{msg.message}</p>
                              <span className="time">{msg.time}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </PerfectScrollbar>
          </ul>
        </div>
        <div className="p-3 chat-input-section">
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
                    <li className="list-inline-item">
                      <Link to="#">
                        <i
                          className="mdi mdi-file-image-outline me-1"
                          id="Imagetooltip"
                        />
                        <UncontrolledTooltip
                          placement="top"
                          target="Imagetooltip"
                        >
                          Images
                        </UncontrolledTooltip>
                      </Link>
                    </li>
                    <li className="list-inline-item">
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
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col className="col-auto">
              <Button
                type="button"
                color="primary"
                onClick={onSend}
                // onClick={() => sendMessage()}
                className="btn btn-primary btn-rounded chat-send"
              >
                <span className="d-none d-sm-inline-block me-2">Send</span>{" "}
                <i className="mdi mdi-send" />
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Chatting
