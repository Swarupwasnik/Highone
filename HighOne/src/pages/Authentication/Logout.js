import React, { useEffect } from "react"
import PropTypes from "prop-types"
import withRouter from "components/Common/withRouter"
import { logoutUser } from "../../store/actions"

//redux
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

const Logout = () => {
  const history = useNavigate()
  const dispatch = useDispatch()
  const name = JSON.parse(localStorage.getItem("User"))

  // useEffect(() => {
  //   dispatch(logoutUser(history));
  // }, [dispatch, history]);

  useEffect(() => {
    if (name == "Admin") {
      localStorage.clear()
      window.location.href = "/login"
    } else {
      localStorage.clear()
      window.location.href = "/teacher_login"
    }
  })

  return <></>
}

Logout.propTypes = {
  history: PropTypes.object,
}

export default withRouter(Logout)
