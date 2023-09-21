import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import * as Yup from "yup"
import { useFormik } from "formik"
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Swal from "sweetalert2"
import Loading from "components/Loading"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import { sessionApi } from "apis/SessionApi"
import { AttendanceContext } from "context/attendanceContext"

const AcademicSession = () => {
  document.title = "Academic Session"
  const { convertDate } = useContext(AttendanceContext)
  const currentDate = new Date()
  const formattedDate = currentDate.toISOString().slice(0, 10)
  const [selectedDate, setSelectedDate] = useState(formattedDate)
  const [loading, setloading] = useState(false)
  const [SessionData, setSessionData] = useState([])
  const [SessionName, setSessionName] = useState("")
  const [SessionStart, setSessionStart] = useState("")
  const [SessionEnd, setSessionEnd] = useState("")
  const [SessionStatus, setSessionStatus] = useState(false)
  const [SessionId, setSessionId] = useState("")
  const [isEdit, setIsEdit] = useState(false)
  console.log(SessionStatus)

  function attendanceListDate(data) {
    const date = new Date(data)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
  }
  const handleDateStart = data => {
    console.log(data)
    const date = new Date(data)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`
    // setSessionStart(convertDate(formattedDate))
    setSessionStart(formattedDate)
    console.log(convertDate(formattedDate))
  }

  const handleDateEnd = data => {
    console.log(data)
    const date = new Date(data)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`
    // setSessionEnd(convertDate(formattedDate))
    setSessionEnd(formattedDate)
    console.log(convertDate(formattedDate))
    console.log(formattedDate)
  }
  const updateSession = edit => {
    setIsEdit(true)
    console.log(edit)
    setSessionName(edit.session_name)
    setSessionStart(edit.start_date)
    setSessionEnd(edit.end_date)
    setSessionStatus(edit.is_active)
    setSessionId(edit.id)
  }

  const makeNewSession = useFormik({
    enableReinitialize: true,
    initialValues: {
      session_name: SessionName,
      start_date: SessionStart,
      end_date: SessionEnd,
      is_active: SessionStatus === true ? "True" : "False",
      session_id: SessionId || "",
    },
    validationSchema: Yup.object().shape({
      session_name: Yup.string().required("Session name is required"),
      start_date: Yup.string().required("Start Date is required"),
      end_date: Yup.string().required("End Date is required"),
      is_active: Yup.string().required("This is required"),
    }),
    onSubmit: values => {
      setloading(true)
      if (isEdit) {
        console.log("update")
        const data = new FormData()
        data.append("session_name", values.session_name)
        data.append("start_date", SessionStart)
        data.append("end_date", SessionEnd)
        data.append("is_active", SessionStatus === true ? "True" : "False")
        data.append("session_id", values.session_id)
        console.log(data)
        sessionApi
          .EditSession(data)

          .then(res => {
            console.log(res.data)
            setloading(false)
            Swal.fire({
              text: res.data.msg,
              icon: res.data.status === 200 ? "success" : "warning",
              imageAlt:
                res.data.status === 200 ? "success image" : "warning image",
            })
            setSessionName("")
            setSessionStart("")
            setSessionEnd("")
            setSessionStatus(false)
            setSessionId("")
            setIsEdit(false)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        const data = new FormData()
        data.append("session_name", values.session_name)
        data.append("start_date", SessionStart)
        data.append("end_date", SessionEnd)
        data.append("is_active", values.is_active)
        console.log(data)
        sessionApi
          .AddSession(data)
          .then(res => {
            setloading(false)
            Swal.fire({
              text: res.data.msg,
              icon: res.data.status === 200 ? "success" : "warning",
              imageAlt:
                res.data.status === 200 ? "success image" : "warning image",
            })
            setSessionName("")
            setSessionStart("")
            setSessionEnd("")
            setSessionStatus(false)
            setSessionId("")
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
  })

  useEffect(() => {
    if (SessionData?.length === 0) {
      setloading(<Loading />)
    }
    sessionApi
      .GetSession()
      .then(res => {
        setSessionData(res.data.session)
        setloading()
      })
      .catch(err => {
        console.log(err)
      })
  }, [loading])

  const onDelete = id => {
    let sid = {
      session_id: id,
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        sessionApi.deleteSession(sid).then(res => {
          Swal.fire("Deleted!", res.data.msg, "success")
          window.location.href = "/academic-session"
        })
      }
    })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs breadcrumbItem="Academic Session" />
          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">
                    {" "}
                    {isEdit
                      ? "Update Academic Session"
                      : "Add New Academic Session"}{" "}
                  </CardTitle>
                  {/* <p className="card-title-desc mb-4">
                      Select From date and To date
                    </p> */}
                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      makeNewSession.handleSubmit()
                    }}
                  >
                    <Row>
                      <Col sm="3">
                        <Label htmlFor="posttitle" className="my-control">
                          Session Name
                        </Label>
                        <Input
                          type="text"
                          name="session_name"
                          className="form-check-Input"
                          placeholder="Session Name"
                          value={SessionName}
                          onChange={e => setSessionName(e.target.value)}
                          invalid={
                            makeNewSession.touched.session_name &&
                            makeNewSession.errors.session_name
                              ? true
                              : false
                          }
                        />
                        {makeNewSession.touched.session_name &&
                        makeNewSession.errors.session_name ? (
                          <FormFeedback type="invalid">
                            {makeNewSession.errors.session_name}
                          </FormFeedback>
                        ) : null}
                      </Col>
                      <Col sm="3">
                        <div className="mb-3">
                          <Label htmlFor="posttitle" className="my-control">
                            Session Start
                          </Label>
                          <Flatpickr
                            className="form-control d-block"
                            placeholder="yyyy-mm-dd"
                            value={SessionStart}
                            onChange={handleDateStart}
                            options={{
                              inline: false,
                              // dateFormat: "d M Y",
                              // altInput: true,
                              // altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                            }}
                            invalid={
                              makeNewSession.touched.start_date &&
                              makeNewSession.errors.start_date
                                ? true
                                : false
                            }
                          />
                          {makeNewSession.touched.start_date &&
                          makeNewSession.errors.start_date ? (
                            <div
                              style={{
                                color: "red",
                                fontSize: "0.625rem",
                                marginTop: "3px",
                              }}
                            >
                              {makeNewSession.errors.start_date}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col sm="3">
                        <div className="mb-3">
                          <Label htmlFor="posttitle" className="my-control">
                            Session End
                          </Label>
                          <Flatpickr
                            className="form-control d-block"
                            placeholder="yyyy-mm-dd"
                            value={SessionEnd}
                            onChange={handleDateEnd}
                            options={{
                              inline: false,
                              // dateFormat: "d M Y",
                              // altInput: true,
                              // altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                            }}
                            invalid={
                              makeNewSession.touched.end_date &&
                              makeNewSession.errors.end_date
                                ? true
                                : false
                            }
                          />
                          {makeNewSession.touched.end_date &&
                          makeNewSession.errors.end_date ? (
                            <div
                              style={{
                                color: "red",
                                fontSize: "0.625rem",
                                marginTop: "3px",
                              }}
                            >
                              {makeNewSession.errors.end_date}
                            </div>
                          ) : null}
                        </div>
                      </Col>

                      <Col sm="1">
                        <div className="mt-3 pt-3">
                          <Input
                            type="checkbox"
                            className="form-check-Input"
                            id="formrow-customCheck"
                            value={SessionStatus}
                            checked={SessionStatus === true ? true : false}
                            onChange={e => setSessionStatus(!SessionStatus)}
                          />
                          <Label
                            className="form-check-Label"
                            htmlFor="formrow-customCheck"
                          >
                            {" "}
                            Active
                          </Label>
                        </div>
                      </Col>

                      <Col sm="2">
                        <div className="mt-4">
                          <Button
                            type="submit"
                            color="primary"
                            className="btn mt-1"
                          >
                            {isEdit ? "Update Session" : "Add Session"}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Col xl="12" sm="12" className="mx-auto mb-4">
            <Row>
              <Card className="shadow-none">
                <CardBody>
                  {loading ? (
                    <div>{loading}</div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table table-striped" id="table-to-xls">
                        <thead>
                          <tr>
                            <th className="">Sr</th>
                            <th className="">Session Name</th>
                            <th className="">Start Date</th>
                            <th className="">End Date</th>
                            <th className="">Status</th>
                            <th className="">Created At</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SessionData?.map((data, index) => (
                            <tr key={index}>
                              <td scope="row">{index + 1}</td>
                              <td>{data.session_name}</td>
                              <td>{convertDate(data.start_date)}</td>
                              <td>{convertDate(data.end_date)}</td>
                              <td className="text-success">
                                {data.is_active ? "Active" : null}
                              </td>
                              <td>
                                {convertDate(
                                  data.created_date.split("T00:00:00")
                                )}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center gap-3">
                                  <Link
                                    // to={`/edit-circular/${cir.id}`}
                                    className="text-success"
                                    onClick={() => {
                                      updateSession(data)
                                    }}
                                  >
                                    <i
                                      className="mdi mdi-pencil font-size-18"
                                      id="edittooltip"
                                    />
                                  </Link>
                                  <Link
                                    to="#"
                                    className="text-danger"
                                    onClick={() => {
                                      onDelete(data.id)
                                    }}
                                  >
                                    <i
                                      className="mdi mdi-delete font-size-18"
                                      id="deletetooltip"
                                    />
                                  </Link>
                                </div>
                              </td>
                              {/* <td>
                              {data.is_active ? (
                                <>
                                  <Input
                                    type="radio"
                                    className="form-check-Input"
                                    id="formrow-customCheck" 
                                    onClick={()=>{
                                      updateSession(data)
                                    }}
                                  />
                                  <text className="text-danger">Inactive</text>
                                </>
                              ) : null}
                            </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Row>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AcademicSession
