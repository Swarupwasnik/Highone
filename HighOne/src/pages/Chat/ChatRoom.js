import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import PerfectScrollbar from "react-perfect-scrollbar"
import avatar1 from "../../assets/images/users/avatar-1.jpg"
import PropTypes from "prop-types"
import classnames from "classnames"
import { Input, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { GetAllTeacher } from "apis/ChatsApi"

const ChatRoom = () => {
  const [activeTab, setactiveTab] = useState("1")
  const [AllUser, setAllUser] = useState([])
  const path = window?.location.pathname.split("/chat/")[1]
  const myuser = JSON.parse(localStorage.getItem("User"))
  const [search, setSearch] = useState("")
  const [FilterData, setFilterData] = useState([])
  const [AdminData, setAdminData] = useState([])

  const handlesearch = e => {
    setSearch(e.target.value)
    searchFilter(e.target.value)
  }

  useEffect(() => {
    GetAllTeacher.GetAllTeacher()
      .then(res => {
        setAllUser(res.data.teacher)
        setAdminData(res.data.admin)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

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

  return (
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
            {/* <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === "2",
                })}
                onClick={() => {
                  toggleTab("2")
                }}
              >
                <i className="bx bx-group font-size-20 d-sm-none" />
                <span className="d-none d-sm-block">Groups</span>
              </NavLink>
            </NavItem> */}
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
                          <Link to={`/chat/${user.id}`} key={user.id}>
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
                                  <i className="mdi mdi-circle text-success align-middle me-2" />
                                  Active
                                </p>
                              </div>
                              <div className="font-size-11">2.30 pm</div>
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
                        AllUser.map(user => (
                          <Link to={`/chat/${user.t_code}`} key={user.t_code}>
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
                                    user.t_name.toLowerCase().slice(1)}
                                </h5>
                                <p className="text-muted mb-0">
                                  <i className="mdi mdi-circle text-success align-middle me-2" />
                                  Active
                                </p>
                              </div>
                              <div className="font-size-11">2.30 pm</div>
                            </div>
                          </Link>
                        ))
                      : FilterData.map(user => (
                          <Link to={`/chat/${user.t_code}`} key={user.t_code}>
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
                                    user.t_name.toLowerCase().slice(1)}
                                </h5>
                                <p className="text-muted mb-0">
                                  <i className="mdi mdi-circle text-success align-middle me-2" />
                                  Active
                                </p>
                              </div>
                              <div className="font-size-11">2.30 pm</div>
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
  )
}

ChatRoom.propTypes = {
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

export default ChatRoom
