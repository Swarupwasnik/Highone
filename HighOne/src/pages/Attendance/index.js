import React, { useContext, useEffect, useState } from "react"
import {
  Container,
  Row,
  Card,
  CardBody,
  Col,
  FormGroup,
  InputGroup,
  CardTitle,
  Input,
  Table,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
  Alert,
} from "reactstrap"
import { Link } from "react-router-dom"
import PerfectScrollbar from "react-perfect-scrollbar"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { AttendanceApi } from "apis/AttendanceApi"
import img1 from "../../assets/image/pre.png"
import img2 from "../../assets/image/abs.png"

import img4 from "../../assets/image/tot.png"
import { classApi } from "apis/ClassListApi"
import ReactHTMLTableToExcel from "react-html-table-to-excel"
import { AttendanceContext } from "context/attendanceContext"
import LeftSidebar from "./LeftSidebar"
import HeaderPopup from "./HeaderPopup"

const index = () => {
  document.title = "Student Attendance"
  var myValue = JSON.parse(localStorage.getItem("User"))
  let teacher_code = myValue?.payload?.t_code ? myValue?.payload?.t_code : ""
  const {
    studentList,
    setStudentList,
    convertDate,
    attendanceDate,
    isLoading,
    classListOption,
    selectedDate,
    handleDateChange,
    classSelect,
    st_class,
    st_sec,
    handleclassselect,
    class_teacher,
    getList,
    data,
    attendence_date,
    setIsLoading,
    session_id,
  } = useContext(AttendanceContext)

  // ================================
  let holiday = studentList.is_holiday || studentList.is_sunday

  const [search, setSearch] = useState("")
  const keys = ["st_name", "st_code"]
  const handlesearch = e => {
    setSearch(e.target.value)
  }

  function takeAddendance(present) {
    AttendanceApi.takeStudentAttendance(present)
      .then(res => {
        if (res.data.status === 200) {
          getList(data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  let onPresent = data => {
    let present = {
      ...data,
      is_present: true,
      is_absent: false,
      teacher_code: teacher_code,
      attendence_date,
      session_id
    }
    takeAddendance(present)
  }
  let onAbsent = data => {
    let absent = {
      ...data,
      is_absent: true,
      is_present: false,
      teacher_code: teacher_code,
      attendence_date,
      session_id
    }

    takeAddendance(absent)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Attendance" breadcrumbItem="Student Attendance" />
          <Row>
            <Col xl={8}>
              <Row>
                <HeaderPopup />
              </Row>
              <Card>
                <CardBody>
                  <Container fluid>
                    <Row>
                      <Col md={11} className="m-auto">
                        <form className="p-0">
                          <div className="input-group ">
                            <input
                              className="form-control bg-light  border"
                              type="search"
                              value={search || ""}
                              onChange={handlesearch}
                              id="search"
                              placeholder="Search by Student code or Name"
                            />
                            <span className="input-group-append">
                              <button className="btn ms-n5" type="button">
                                <i className="fa fa-search"></i>
                              </button>
                            </span>
                          </div>
                        </form>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} className="m-auto">
                        <div className="mt-4">
                          {isLoading ? (
                            <div
                              style={{ height: "310px" }}
                              className=" align-center text-center"
                            >
                              <Spinner
                                color="primary"
                                style={{
                                  marginTop: "5rem",
                                  height: "3rem",
                                  width: "3rem",
                                  textAlign: "center",
                                }}
                              >
                                Loading...
                              </Spinner>{" "}
                            </div>
                          ) : (
                            ""
                          )}

                          {studentList?.student?.length === 0 ? (
                            <div
                              style={{ height: "310px" }}
                              className="align-center text-center"
                            >
                              <h3 className="text-primary mt-5 ">
                                Students Data Not Found !
                              </h3>
                            </div>
                          ) : (
                            !isLoading && (
                              <PerfectScrollbar style={{ height: "310px" }}>
                                <div className="table-responsive">
                                  <Table className="table-sm  table-nowrap align-center text-center table-borderless">
                                    <thead className="">
                                      <tr className="">
                                        <th
                                          className="p-2 text-uppercase"
                                          scope="col"
                                        >
                                          <h6>Student Code</h6>
                                        </th>
                                        <th
                                          className="p-2 ps-5 text-uppercase text-start"
                                          scope="col"
                                        >
                                          <h6>Name</h6>
                                        </th>
                                        <th
                                          className="p-2 text-uppercase"
                                          scope="col"
                                        >
                                          <h6>Attendance</h6>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {studentList?.student
                                        ?.filter(stu =>
                                          keys.some(key =>
                                            stu[key]
                                              .toLowerCase()
                                              .includes(search.toLowerCase())
                                          )
                                        )
                                        .map((stu, index) => (
                                          <tr key={index}>
                                            <td className="p-0">
                                              <Link
                                                to={`/student-report/${stu.st_code}`}
                                                className="text-secondary"
                                                state={stu}
                                              >
                                                {stu.st_code}
                                              </Link>
                                            </td>
                                            <td className="ps-5 text-start">
                                              <h5 className="text-truncate font-size-13 ">
                                                <Link
                                                  to={`/student-report/${stu.st_code}`}
                                                  className="text-secondary"
                                                  state={stu}
                                                >
                                                  {stu.st_name}
                                                </Link>
                                              </h5>
                                            </td>
                                            <td className="p-0">
                                              {holiday ? (
                                                <Link
                                                  to="#"
                                                  className="text-danger"
                                                >
                                                  <b className="">H</b>
                                                </Link>
                                              ) : myValue == "Admin" ? (
                                                <div className="d-flex justify-content-center gap-3 ">
                                                  {stu.is_present ? (
                                                    <Link
                                                      to="#"
                                                      className="text-success"
                                                    >
                                                      <span
                                                        className="mdi mdi-check mdi-24px "
                                                        id="present"
                                                      ></span>
                                                    </Link>
                                                  ) : stu.is_absent ? (
                                                    <Link
                                                      to="#"
                                                      className="text-danger"
                                                    >
                                                      <span
                                                        className="mdi mdi-window-close mdi-24px"
                                                        id="absent"
                                                      ></span>
                                                    </Link>
                                                  ) : (
                                                    <Link
                                                  to="#"
                                                  className="text-success"
                                                >
                                                  <b className="">NA</b>
                                                </Link>
                                                  )}
                                                </div>
                                              ) : class_teacher ? (
                                                <div className="d-flex justify-content-center gap-3 ">
                                                  <Link
                                                    to="#"
                                                    className={
                                                      stu.is_present
                                                        ? "text-success"
                                                        : "text-secondary"
                                                    }
                                                    onClick={() =>
                                                      onPresent(stu)
                                                    }
                                                  >
                                                    <span
                                                      className="mdi mdi-check mdi-24px "
                                                      id="present"
                                                    ></span>
                                                  </Link>
                                                  <Link
                                                    to="#"
                                                    className={
                                                      stu.is_absent
                                                        ? "text-danger"
                                                        : "text-secondary"
                                                    }
                                                    onClick={() =>
                                                      onAbsent(stu)
                                                    }
                                                  >
                                                    <span
                                                      className="mdi mdi-window-close mdi-24px"
                                                      id="absent"
                                                    ></span>
                                                  </Link>
                                                </div>
                                              ) : (
                                                <div className="d-flex justify-content-center gap-3 ">
                                                  {stu.is_present ? (
                                                    <Link
                                                      to="#"
                                                      className="text-success"
                                                    >
                                                      <span
                                                        className="mdi mdi-check mdi-24px "
                                                        id="present"
                                                      ></span>
                                                    </Link>
                                                  ) : stu.is_absent ? (
                                                    <Link
                                                      to="#"
                                                      className="text-danger"
                                                    >
                                                      <span
                                                        className="mdi mdi-window-close mdi-24px"
                                                        id="absent"
                                                      ></span>
                                                    </Link>
                                                  ) : (
                                                    ""
                                                  )}
                                                </div>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </Table>
                                </div>
                              </PerfectScrollbar>
                            )
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Container>
                  <hr className="mb-4" />
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <LeftSidebar />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default index
