import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Row } from "reactstrap"
import PieChart from "../AllCharts/apex/PieChart"
import { AcademicCalenderApi } from "apis/AcademicCalenderApi"
import config from "config/config"
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en.json"
import ru from "javascript-time-ago/locale/ru.json"
import ReactTimeAgo from "react-time-ago"
import { DashboardAPI } from "apis/DashboardAPI"

const Performance = ({ body, classSelect }) => {
  const [academicCalender, setAcademicCalender] = useState([])
  const [circularList, setCircularList] = useState([])
  const [TestResult, setTestResult] = useState({})

  const circularShow = async body => {
    // console.log(body)
    await DashboardAPI.getDashboard(body)
      .then(res => {
        if (res.data.status === 200) {
          setCircularList(res.data.payload.circular)
          setTestResult(res.data.payload.test_result)
          setAcademicCalender(res.data.payload.acedemic_calendar)
        } else {
          console.log("Not found")
        }
      })
      .catch(err => console.log(err.message))
  }

  useEffect(() => {
    circularShow(body)
  }, [classSelect])

  function convertDate(data) {
    const dateString = data
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      // year: "numeric",
    })
    return formattedDate
  }

  return (
    <React.Fragment>
      <Col xl={6}>
        <h4 className="mb-sm-0 font-size-18 pb-2">Recent Online Test Performance</h4>

        <Card>
          <CardBody>
            <PieChart
              dataColors='["--bs-secondary","--bs-primary","--bs-success", "--bs-warning", "--bs-info", "--bs-danger"]'
              data={TestResult}
            />
            <p className="text-muted mb-0 text-truncate font-size-12">
              <i className="bx bxs-info-circle px-1"></i>
              Performance is calculated from average Percentage of whole class
            </p>
          </CardBody>
        </Card>
        {/* <Card>
          <CardBody>
            {circularList?.timetable?.map((time,index)=> (
              <div className="d-flex flex-wrap justify-content-between" key={index}>
                <h5 className="card-title mb-0 me-2 font-size-18">
                  Time Table
                </h5>
                <div className="d-flex flex-wrap pe-2">
                  <a
                    href={`${config.BaseImageUrl}/${time.timetable}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary pt-1"
                  >
                    <i className="bx bxs-file-pdf text-danger font-size-24"></i>
                  </a>
                </div>
              </div>
            ))}
          </CardBody>
        </Card> */}

        <Card>
          <CardBody className="p-3">
            <h4 className="me-2 font-size-18">Circular</h4>
            <div className="rounded">
              {circularList?.map((cir, index) => (
                <Card key={index} className="p-1 border border-1 bg-light m-1">
                  <CardBody className="p-1">
                    <a
                      href={
                        cir.notice_file
                          ? `${config.BaseImageUrl}/${cir.notice_file}`
                          : "#"
                      }
                      target={cir.notice_file ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                    >
                      <Row className="">
                        <Col lg={12}>
                          <div className="d-flex flex-wrap justify-content-between">
                            <h5 className="text-dark text-uppercase">
                              {cir.title}
                            </h5>
                            <div></div>
                            <span className="text-end">
                              <p className="text-dark font-size-10">
                                <ReactTimeAgo
                                  date={cir.notice_date}
                                  locale="en-US"
                                />
                              </p>
                              {cir?.notice_file ? (
                                cir?.notice_file?.split(".").at(-1) == "pdf" ? (
                                  <a
                                    href={`${config.BaseImageUrl}/${cir.notice_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-dark"
                                  >
                                    <i
                                      className="bx bxs-file-pdf text-danger font-size-24 bg-light p-1"
                                      style={{ borderRadius: 50 }}
                                    ></i>
                                  </a>
                                ) : (
                                  <a
                                    href={`${config.BaseImageUrl}/${cir.notice_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-dark"
                                  >
                                    <i
                                      className="bx bxs-image-alt text-success font-size-24 bg-light p-1"
                                      style={{ borderRadius: 50 }}
                                    ></i>
                                  </a>
                                )
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                          <p className="text-dark m-1 text-wrap lh-1">
                            {cir.description}
                          </p>
                        </Col>
                      </Row>
                    </a>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
        {/* {academicCalender
          ? academicCalender.map(item => (
              <Card key={item.id}>
                <a
                  href={`${config.BaseImageUrl}/${item.academic_calender}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary"
                >
                  <CardBody>
                    <div className="d-flex flex-wrap justify-content-between">
                      <h5 className="card-title mb-0 me-2 font-size-18 text-primary">
                        Academic Calender
                      </h5>
                      <div className="d-flex flex-wrap pe-2">
                        <i className="bx bxs-file-pdf text-danger font-size-24"></i>
                      </div>
                    </div>
                  </CardBody>
                </a>
              </Card>
            ))
          : ""} */}
      </Col>
    </React.Fragment>
  )
}

export default Performance
