import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Input,
  Form,
  Label,
  Button,
} from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import { classApi } from "apis/ClassListApi"
import { SyllabusApi } from "apis/SyllabusAPI"
import config from "config/config"
import Swal from "sweetalert2"
import Loading from "components/Loading"
import { SessionContext } from "context/sessionContext"
import { TimetableApi } from "apis/TimeTableApi"
import AnnualResultmodel from "./AnnualResultModel"
import { AnnualResultApi } from "apis/AnnualResultAPI"
import { useFormik } from "formik"
import * as Yup from "yup"

const AnnualResult = () => {
  document.title = "Annual Result "
  const myAdmin = JSON.parse(localStorage.getItem("Admin"))
  const myUser = JSON.parse(localStorage.getItem("User"))
  let user = myAdmin?.name
  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")

  const [classList, setClassList] = useState([])
  const [sectionList, setSectionList] = useState([])
  const [studentList, setStudentList] = useState([])
  // console.log(studentList)
  const [timetableList, setTimetableList] = useState([])
  const [loader, setLoader] = useState()
  const [files1, setFiles1] = useState("")
  const [f_class, setF_class] = useState("")
  const [f_section, setF_section] = useState("")
  const [resultId, setResultId] = useState("")
  console.log(resultId, "select")
  let data = {
    st_class: f_class || "",
  }

  useEffect(() => {
    AnnualResultApi.getAllClassList()
      .then(res => {
        setClassList(res.data.class)
      })
      .catch(err => console.log(err.message))
  }, [])
  useEffect(() => {
    AnnualResultApi.getSectionList(data)
      .then(res => {
        setSectionList(res.data.section)
      })
      .catch(err => console.log(err.message))
  }, [f_class])

  var sdata = {
    st_class: f_class || " ",
    st_sec: f_section || " ",
    session_id: session,
  }

  function getResult(data) {
    AnnualResultApi.getStudentList(data)
      .then(res => {
        if (res.data.status === 200) {
          setLoader("")
        }
        // setStudentList(res.data.student)
      })
      .catch(err => console.log(err.message))
  }

  useEffect(() => {
    if (studentList?.length === 0) {
      setLoader(<Loading />)
    }
    getResult(sdata)
  }, [f_class, f_section])

  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      session_id: session,
      id: resultId,
      result: "",
    },
    validationSchema: Yup.object({
      result: Yup.mixed().required("Please upload a PDF file."),
    }),

    onSubmit: values => {
      const data = new FormData()
      data.append("id", resultId)
      data.append("session_id", session)
      data.append("result", values.result)
      console.log(data)
      AnnualResultApi.addAnnualResult(data)
        .then(res => {
          console.log(res)
          if (res.data.status === 200) {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                formClear()
              }
            })
          }
          if (res.data.status === 403) {
            Swal.fire({
              text: res.data.msg,
              icon: "info",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                // toggle()
              }
            })
          }
        })
        .catch(err => console.log(err.message))
    },
  })

  const onDelete = id => {
    let sid = {
      result_id: id,
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
        AnnualResultApi.deleteResult(sid).then(res => {
          Swal.fire("Deleted!", res.data.msg, "success")
          getResult(sdata)
        })
      }
    })
  }

  // const handleSubmit = d => {
  //   console.log(d)
  //   if (files1 === "") {
  //     Swal.fire({
  //       text: "Please upload a Result.",
  //       icon: "warning",
  //       imageAlt: "warning image",
  //     }).then(e => {
  //       console.log(e.message)
  //     })
  //   } else {
  //     const uploaddata = new FormData()
  //     uploaddata.append("id", resultId)
  //     uploaddata.append("session_id", session)
  //     uploaddata.append("result", files1)
  //     AnnualResultApi.addAnnualResult(uploaddata)
  //       .then(res => {
  //         console.log(res)
  //         if (res.data.status === 200) {
  //           Swal.fire({
  //             text: res.data.msg,
  //             icon: "success",
  //             imageAlt: "success image",
  //           }).then(result => {
  //             if (result.isConfirmed) {
  //               formclear()
  //             }
  //           })
  //         }
  //       })
  //       .catch(err => console.log(err.message))
  //   }
  // }

  useEffect(() => {
    const ShowAnnualReport = async () => {
      let body = {
        session_id: session,
        st_class: f_class,
        st_sec: f_section,
      }

      await AnnualResultApi.showAnnualResult(body).then(res => {
        console.log(res.data.annual_report)
        setStudentList(res.data.annual_report)
        setLoader("")
      })
    }
    ShowAnnualReport()
  }, [f_class, f_section, session])

  var formClear = () => {
    getResult(sdata)
    setResultId("")
    validation.resetForm()
    // setFiles1("")
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Annual Result"
            breadcrumbItem="Annual Result List"
          />

          <Col xl="10" sm="12" className="mx-auto mb-4">
            <Row>
              <Col md={3} className="">
                <div className="mb-3">
                  <div className="col-sm-12">
                    <select
                      className="form-select"
                      type="select"
                      name="class"
                      value={f_class}
                      onChange={e => setF_class(e.target.value)}
                    >
                      <option value="">Select Class</option>
                      {classList?.map((class1, index) => (
                        <option key={index} value={class1.st_class}>
                          {class1.st_class.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Col>
              <Col md={3} className="">
                <div className="mb-3">
                  <div className="col-sm-12">
                    <select
                      className="form-select"
                      type="select"
                      name="class"
                      value={f_section}
                      onChange={e => setF_section(e.target.value)}
                    >
                      <option value="">Select Section</option>
                      {sectionList?.map((class1, index) => (
                        <option key={index} value={class1.st_sec}>
                          {class1.st_sec.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Col>
              <Col md={2}></Col>
              <Col md={4} className="">
                {/* <AnnualResultmodel /> */}
              </Col>
            </Row>
          </Col>
          <Col xl="10" sm="12" className="mx-auto mb-4">
            <Row>
              {loader ? <div>{loader}</div> : null}
              {studentList?.length === 0
                ? !loader && (
                    <Card className="shadow-none">
                      <div
                        style={{ height: "310px" }}
                        className="align-center text-center"
                      >
                        <h2 className="text-primary mt-5 ">
                          Student List Not Found !
                        </h2>
                      </div>
                    </Card>
                  )
                : !loader && (
                    <Card className="table-responsive">
                      <CardBody className="table table-striped">
                        <Card>
                          <Row className="text-center">
                            <Col className="fw-bold">Sr No</Col>
                            <Col className="fw-bold">Std. No</Col>
                            <Col className="fw-bold">Student Code</Col>
                            <Col className="fw-bold">Student Name</Col>
                            <Col className="fw-bold">Class</Col>
                            <Col className="fw-bold">File</Col>
                            {/* <th className="">Upload File</th> */}
                            {/* <Col className="fw-bold">Action</Col> */}
                          </Row>
                        </Card>
                        <Card>
                          {studentList?.map((stu, index) => (
                            <Card key={index}>
                              <CardBody>
                                {/* <Form
                                  onSubmit={e => {
                                    e.preventDefault()
                                    validation.handleSubmit()
                                    return false
                                  }}
                                > */}
                                <Row className="text-center">
                                  <Col className="">{index + 1}</Col>
                                  <Col className="">
                                    {`${stu.slno}`.toUpperCase()}
                                  </Col>
                                  <Col className="">
                                    {`${stu.st_code}`.toUpperCase()}
                                  </Col>
                                  <Col className="">
                                    {`${stu.st_name}`.toUpperCase()}
                                  </Col>
                                  <Col className="">
                                    {`${stu.st_class}`.toUpperCase() +
                                      `${
                                        stu.st_sec === ""
                                          ? ""
                                          : " - " + stu.st_sec
                                      }`.toUpperCase()}
                                  </Col>
                                  <Col>
                                    {stu.result ? (
                                      <a
                                        href={`${config.BaseImageUrl}/${stu.result}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-secondary"
                                      >
                                        <i
                                          className="bx bx-download font-size-18"
                                          id="download"
                                        />
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                  </Col>
                                  {/* <Col className="d-flex align-items-center justify-content-evenly">
                                      <Label
                                        htmlFor="uploadfile"
                                        className="upload_label"
                                      >
                                        <i className="bx bxs-cloud-upload block_cloud"></i>
                                      </Label>
                                      <Input
                                        name="result"
                                        type="file"
                                        className="form-control hidden_upload"
                                        id="uploadfile"
                                        accept=".pdf"
                                        onChange={e => {
                                          // setFiles1(e.target.files[0]),
                                          validation.setFieldValue(
                                            "result",
                                            e.target.files[index]
                                          )
                                          console.log(e.target.files[0])
                                        }}
                                        onClick={() => {
                                          setResultId(stu.id)
                                        }} 
                                        // invalid={
                                        //   validation.touched.result &&
                                        //   validation.errors.result
                                        //     ? true
                                        //     : false
                                        // }
                                      
                                       {validation.touched.result &&
                                      validation.errors.result ? (
                                        <div
                                          style={{
                                            color: "red",
                                            fontSize: "11px",
                                            marginTop: "3px",
                                          }}
                                        >
                                          {validation.errors.result}
                                        </div>
                                      ) : null} 
                                      {stu.result ? (
                                        <Link
                                          to="#"
                                          className="text-danger text-center"
                                          onClick={() => {
                                            onDelete(stu.id)
                                          }}
                                        >
                                          <i
                                            className="mdi mdi-delete font-size-18"
                                            id="deletetooltip"
                                          />
                                        </Link>
                                      ) : (
                                        <Button
                                          type="submit"
                                          color="success"
                                          size="sm"
                                          // onClick={() => handleSubmit(stu)}
                                        >
                                          Upload
                                        </Button>
                                      )}   
                                    </Col> */}
                                </Row>{" "}
                                {/* </Form> */}
                              </CardBody>
                            </Card>
                          ))}
                        </Card>
                      </CardBody>
                    </Card>
                  )}
            </Row>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AnnualResult
