import React, { useEffect, useState } from "react"
import {
  Container,
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Input,
  FormGroup,
  InputGroup,
} from "reactstrap"
import { Link, useLocation, useParams } from "react-router-dom"
import Knob from "../AllCharts/knob/knob"
import Flatpickr from "react-flatpickr"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { AttendanceApi } from "apis/AttendanceApi"
import HeaderPopup from "./HeaderPopup"
import ReportLeftSidebar from "./ReportLeftSidebar"

const StudentReport = () => {
  //meta title
  document.title = "Student Report"

  const currentDate = new Date()
  const formattedDate = currentDate.toISOString().slice(0, 10)
  const [activeTab, setActiveTab] = useState("1")
  // const [absent, setabsent] = useState(14)
  const [session, setSession] = useState(null)
  const [present, setpresent] = useState(null)
  const [studentList, setStudentList] = useState([])
  const [studentDetail, setStudentDetail] = useState([])
  let mon_average = studentDetail?.payload?.month_average.toFixed(2)
  let sec_average = studentDetail?.payload?.session_average.toFixed(2)

  const [selectedDate, setSelectedDate] = useState(formattedDate)
  // const { st_code } = useParams()
  const location = useLocation()
  const studentData = location.state

  const handleDateChange = e => {
    setSelectedDate(e.target.value)
  }

  useEffect(() => {
    let data = {
      st_class: "x",
      st_sec: "JDB",
      attendence_date: selectedDate,
    }
    AttendanceApi.getAllStudentList(data)
      .then(res => {
        setStudentList(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    AttendanceApi.getStudentAttendanceDetails(studentData)
      .then(res => {
        setStudentDetail(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [studentData])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Student Attendance" breadcrumbItem="Student Report" />
          <Row>
            <Col xl={8}>
              <Row>
                <HeaderPopup />
              </Row>
              <Card>
                <CardBody>
                  <Col xl={12}>
                    <Row className="">
                      <Col xl={12}>
                        <Card className="shadow-none">
                          <CardBody>
                            <CardTitle className="h4"></CardTitle>
                            <div className="table-responsive text-center">
                              <Table className="table table-borderless mb-0">
                                <thead>
                                  <tr>
                                    <th>
                                      <h5 className="text-muted mb-1">Sr</h5>
                                    </th>
                                    <th>
                                      <h5 className="text-muted mb-1">
                                        Student Code
                                      </h5>
                                    </th>
                                    <th>
                                      <h5 className="text-muted mb-1">Name</h5>
                                    </th>
                                    <th>
                                      <h5 className="text-muted mb-1">
                                        Attendance
                                      </h5>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row">1</th>
                                    <td>
                                      {
                                        studentDetail?.payload?.attendance
                                          ?.st_code
                                      }
                                    </td>
                                    <td>
                                      {
                                        studentDetail?.payload?.attendance
                                          ?.st_name
                                      }
                                    </td>
                                    <td>
                                      <div className="mx-2">
                                        <span
                                          // className="text-secondary mx-2"
                                          className={
                                            studentDetail?.payload?.attendance
                                              ?.is_present
                                              ? "text-success mx-2"
                                              : "text-secondary mx-2"
                                          }
                                        >
                                          <span
                                            className="mdi mdi-check mdi-24px "
                                            id="edittooltip"
                                          ></span>
                                        </span>
                                        <span
                                          className={
                                            studentDetail?.payload?.attendance
                                              ?.is_absent
                                              ? "text-danger mx-2"
                                              : "text-secondary mx-2"
                                          }
                                        >
                                          <span
                                            className="mdi mdi-window-close mdi-24px"
                                            id="deletetooltip"
                                          ></span>
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                            <Row className="">
                              <Col sm={6}>
                                <div className="text-center" dir="ltr">
                                  <Knob
                                    value={sec_average}
                                    fgColor="#556ee6"
                                    thickness={0.15}
                                    readOnly={true}
                                    height={100}
                                    width={100}
                                    onChange={e => {
                                      setSession(e)
                                    }}
                                  />
                                  <h5 className="font-size-14 mt-3">
                                    Session Average
                                  </h5>
                                </div>
                              </Col>
                              <Col sm={6}>
                                <div className="text-center" dir="ltr">
                                  <Knob
                                    value={mon_average}
                                    fgColor="#34c38f"
                                    thickness={0.15}
                                    readOnly={true}
                                    height={100}
                                    width={100}
                                    onChange={e => {
                                      setpresent(mon_average)
                                    }}
                                  />
                                  <h5 className="font-size-14 mt-3">
                                    Monthly Average
                                  </h5>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <hr className="mb-4" />
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <ReportLeftSidebar/>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default StudentReport
