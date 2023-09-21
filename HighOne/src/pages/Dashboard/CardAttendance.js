import React, { useEffect, useState } from "react"
import { Card, CardBody, Col, Row, Button } from "reactstrap"
import getChartColorsArray from "../../components/Common/ChartsDynamicColor"
import { useSelector, useDispatch } from "react-redux"
import { dashboardBlogVisitorData } from "../../store/actions"
import Studymaterial from "./Studymaterial"
import { Link } from "react-router-dom"
import { DashboardAPI } from "apis/DashboardAPI"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en.json"
import ru from "javascript-time-ago/locale/ru.json"
import ReactTimeAgo from "react-time-ago"

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const CardAttendance = ({ body, classSelect }) => {
  const [Attendance, setAttendance] = useState([])

  const getAttendance = async body => {
    // const body = {
    //   teacher_code: "",
    //   st_class: "viii",
    //   st_sec: "AB",
    //   user_type: "Admin",
    //   session_id: "18",
    // }
    await DashboardAPI.getDashboard(body).then(res => {
      if (res.data.status === 200) {
        setAttendance(res.data.payload)
      } else {
        console.log("Not found")
      }
    })
  }

  useEffect(() => {
    getAttendance(body)
  }, [classSelect])

  return (
    <React.Fragment>
      <Col xl={6}>
        <h4 className="font-size-18">Today's Attendance</h4>
        <div className="row">
          <div className="col-lg-4">
            <div className="mini-stats-wid my-cursor card">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-center align-items-center ">
                  <div className="me-3">
                    <h5 className="text-white mb-2">Total</h5>
                    <h3 className="mb-0">{Attendance.total_student}</h3>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-transparent rounded-circle text-primary font-size-20">
                      <img
                        src="/static/media/tot.c85588c65462c734a689.png"
                        alt="pre"
                        width={59}
                      />
                    </div>
                  </div>
                </div>
                <div />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="blog-stats-wid my-cursor card">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-center align-items-center ">
                  <div className="me-3 ">
                    <h5 className="text-white mb-2">Present</h5>
                    <h3 className="mb-0 ">{Attendance.present_count}</h3>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-transparent  rounded-circle text-primary font-size-20">
                      <img
                        src="/static/media/pre.7c2f29d4592c72520157.png"
                        alt="pre"
                        width={59}
                      />
                    </div>
                  </div>
                </div>
                <div />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="blog-stats-wid my-cursor card">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-center align-items-center">
                  <div className="me-3">
                    <h5 className="text-white mb-2">Absent</h5>
                    <h3 className="mb-0 ">{Attendance.absent_count}</h3>
                  </div>
                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-transparent rounded-circle text-primary font-size-20">
                      <img
                        src="/static/media/abs.b232f3c2261385224cb8.png"
                        alt="pre"
                        width={59}
                      />
                    </div>
                  </div>
                </div>
                <div />
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardBody>
            <h4 className="font-size-18">Post</h4>
            <Row className="">
              {Attendance.post?.map(
                ({
                  id,
                  title,
                  description,
                  media,
                  created_date,
                  subject_code,
                }) => {
                  return (
                    <Col lg={12} className="text-dark rounded my-2" key={id}>
                      <div className="mt-0 bg-light rounded p-2">
                        <div className="d-flex justify-content-between">
                          <h5 className="text-dark mb-0 text-wrap">{title}</h5>
                          <p className="text-dark mb-0 text-truncate font-size-10 text-end">
                            <ReactTimeAgo date={created_date} locale="en-US" />
                          </p>
                          {/* <p color="dark" className="btn-rounded font-size-8 bg-light text-white px-2">
                            <ReactTimeAgo date={created_date} locale="en-US" />
                          </p> */}
                        </div>
                        <p className="text-dark mb-0 text-wrap">
                          {description}
                        </p>
                      </div>
                    </Col>
                  )
                }
              )}

              <Link
                to="/post"
                className="text-muted mb-0 font-size-12 text-end"
              >
                <u>View All</u>
              </Link>
            </Row>
          </CardBody>
        
          <CardBody>
            <Row>
              <h3 className="mb-3 me-2 font-size-18">Notes</h3>
              {Attendance?.studay_material?.map(
                ({ id, chapter, subject, notes1, uploaded_date, lession }) => {
                  return (
                    <Studymaterial
                      key={id}
                      id={id}
                      chapter={chapter}
                      subject={subject}
                      notes1={notes1}
                      uploaded_date={uploaded_date}
                      lession={lession}
                    />
                  )
                }
              )}
              <Link to="/notes" className="text-muted font-size-12 text-end">
                <u>View All</u>
              </Link>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default CardAttendance
