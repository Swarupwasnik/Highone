import PropTypes from "prop-types"
import React, { useContext, useEffect, useState } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"
import logo from "../../assets/images/SPS Logo - Golden.png"
import { withTranslation } from "react-i18next"
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions"
import { sessionApi } from "apis/SessionApi"
import { SessionContext } from "context/sessionContext"

const Header = props => {
  // const [SessionData, setSessionData] = useState([])
  const { SessionData, Session, setSession ,handlesessionselect} = useContext(SessionContext)
  const [loading, setloading] = useState(false)

  function tToggle() {
    var body = document.body
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable")
    } else {
      body.classList.toggle("vertical-collpsed")
      body.classList.toggle("sidebar-enable")
    }
  }

  // useEffect(() => {
  //   sessionApi
  //     .GetSession()
  //     .then(res => {
  //       setSessionData(res.data.session)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }, [ ])

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logo} alt="" height="22" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle()
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars py-5 my-2" />
            </button>

            <i className="bx bxs-calendar font-size-24 py-5 my-2"></i>
            <div className="mx-1 my-5">
              <select
                className="form-select border border-none"
                type="select"
                name="class"
                value={Session}
                onChange={handlesessionselect}
              >
                <option disabled value="" style={{ fontWeight: "bold" }}>
                  Select Session
                </option>
                {SessionData?.map((data, index) =>(
                    <option
                      key={index}
                      value={data.id}
                      // selected={data.is_active === true ? data.id : null}
                    >
                      {data.session_name.toUpperCase()}
                    </option>
                  )
                )}
              </select>
            </div>

            <div
              className="text-danger py-5"
              style={{
                fontWeight: "500",
                marginLeft: "10rem",
                fontSize: "27px",
              }}
            >
              SOUTH POINT SCHOOL , GUWAHATI
            </div>
          </div>
          <div className="d-flex">
            {/* <NotificationDropdown /> */}
            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
