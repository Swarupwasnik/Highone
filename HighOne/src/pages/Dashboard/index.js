import React, { useContext, useEffect, useState } from "react"
import { Col, Container, Row } from "reactstrap"
import CardAttendance from "./CardAttendance"
import Performance from "./Performance"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { SessionContext } from "context/sessionContext"
import Loading from "components/Loading"
import { useClass } from "context/attendanceContext"

const index = () => {
  const [loading, setLoading] = useState(false)
  const { Session } = useContext(SessionContext)
  let session_id = Session || sessionStorage.getItem("SessionId")
  document.title = "Dashboard"
  var user = JSON.parse(localStorage.getItem("User"))
  let teacher_code = user?.payload?.t_code ? user?.payload?.t_code : ""
  let st_class = user?.payload?.home_class ? user?.payload?.home_class : ""
  let st_sec = user?.payload?.home_sec ? user?.payload?.home_sec : ""
  const { classListOption, handleclassselect, classSelect } = useClass()

  const defaultClass = classListOption[0]?.label
  const body = {
    teacher_code: teacher_code,
    st_class: st_class || classSelect.substring(0, classSelect.lastIndexOf(" ")) || defaultClass?.substring(0, defaultClass.lastIndexOf(" ")),
    st_sec: st_sec || classSelect.substring(classSelect.lastIndexOf(" ") + 1) || defaultClass?.substring(defaultClass.lastIndexOf(" ") + 1),
    user_type: user === "Admin" ? "Admin" : "Teacher",
    session_id: session_id,
  }

  useEffect(() => {
    if (!body.st_class || !body.st_sec) {
      setLoading(true)
      // return <NoDataFound />
    } else {
      setLoading(false)
    }
  }, [classSelect, defaultClass])

  const NoDataFound = () => {
    return (
      <div className="m-auto text-center">
        <h5 className="text-secondary"> Please select class</h5>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={10}>
              <h4 className="text-primary">
                <i className="bx bx-home-circle font-size-22"></i> DASHBOARD
              </h4>
            </Col>
            <Col lg={2}>
              <div className="d-flex">
                {/* <h4 className="card-title text-start col-4">Select Class</h4> */}
                <select
                  value={classSelect}
                  className="form-select"
                  type="select"
                  name="class"
                  onChange={handleclassselect}
                >
                  <option value="" style={{ fontWeight: "bold" }} disabled>
                    Select Class
                  </option>
                  {classListOption?.map((class1, index) => (
                    <option key={index} value={class1.label}>
                      {class1.label.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
            {session_id === null ? (
              <Loading />
            ) : loading ? (
              <NoDataFound />
            ) : (
              <>
                <CardAttendance body={body} classSelect={classSelect} />
                <Performance body={body} classSelect={classSelect} />
              </>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default index
