import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import * as Yup from "yup"
import { useFormik } from "formik"
import { TestApi } from "apis/TestApi"
import { classApi } from "apis/ClassListApi"

import {
  Col,
  Row,
  Container,
  Label,
  CardTitle,
  Table,
  Card,
  CardBody,
} from "reactstrap"
import Swal from "sweetalert2"
import { SessionContext } from "context/sessionContext"
import { ExamTestApi } from "apis/ExamTestAPI"

const TestPage = () => {
  document.title = "Exam Test"
  const name = JSON.parse(localStorage.getItem("User"))
  const { Session } = useContext(SessionContext)
  const sessionId = Session || window.sessionStorage.getItem("SessionId")
  const [classList, setClassList] = useState([])
  const [testdata, setTestdata] = useState([])
  const [f_class, setF_class] = useState("")
  const [f_subject, setF_subject] = useState("")
  const [classSectionListOption, setClassSectionListOption] = useState([])
  const [teachersubject, setTeacherSubject] = useState([])

  let filterClassSectionList = classSectionListOption?.filter(
    (list, index, arr) => {
      return index === arr.findIndex(d => d.label === list.label)
    }
  )
  // console.log(testdata.upcomming_test)

  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        setClassList(res.data)
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })

    if (name === "Admin") {
      setClassSectionListOption(
        classList.class?.map(cl => {
          return {
            value: cl.uid,
            label: `${cl.st_class}`,
          }
        })
      )
    }

    if (name != "Admin") {
      setClassSectionListOption(
        name?.teacher_subject?.map(cl => {
          return {
            value: cl.uid,
            label: `${cl.st_class} ${cl.st_sec}`,
          }
        })
      )
    }
  }, [])

  const str = f_class
  const parts = str.split(" ")
  let sel_class = parts[0]
  let sel_section = parts[1]

  useEffect(() => {
    let data = {
      t_code: "",
      st_class: sel_class || "",
      st_sec: sel_section || "",
    }
    classApi
      .getTeacherSubject(data)
      .then(res => {
        setTeacherSubject(res.data.subject)
      })
      .catch(err => {
        console.log(err)
      })
  }, [sel_class, sel_section])

  let suboption = name?.teacher_subject
    ?.filter(sub =>
      classList?.subject?.some(s => sub.subject_code === s.subject_code)
    )
    .map(sub => {
      let match = classList?.subject?.find(
        s => sub.subject_code === s.subject_code
      )

      return {
        value: match.subject_code,
        label: match.subject_name,
      }
    })

  let subject_list = suboption?.filter((obj, index, arr, t) => {
    return index === arr.findIndex(d => d.value === obj.value)
  })

  const classListOption = classList?.section_list?.map(cl => {
    return {
      value: cl.UID,
      label: `${cl.st_class} ${cl.st_sec}`,
    }
  })

  const subjectListOption = classList?.subject?.map(sub => {
    return {
      value: sub.subject_code,
      label: sub.subject_name,
    }
  })

  const GetquizData = () => {
    let teacherCode = {
      teacher_code: name?.payload?.t_code ? name?.payload?.t_code : "",
      class: f_class || "",
      subject: f_subject || "",
      session_id: sessionId,
      user_type: name == "Admin" ? "Admin" : "Teacher",
    }
    TestApi.getAllTestQuiz(teacherCode)
      .then(res => {
        setTestdata(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    GetquizData()
  }, [sessionId, f_class, f_subject])

  function formatDate(dateString) {
    const dateObj = new Date(dateString)
    const day = dateObj.getDate()
    const month = dateObj.getMonth() + 1 // add 1 because getMonth() returns a zero-based index
    const year = dateObj.getFullYear()

    // pad single digit numbers with a leading zero
    const formattedDay = day.toString().padStart(2, "0")
    const formattedMonth = month.toString().padStart(2, "0")

    // return the formatted date string
    return `${formattedDay}-${formattedMonth}-${year}`
  }

  const onTestDelete = testId => {
    let teacherCode = {
      teacher_code: name?.payload?.t_code ? name?.payload?.t_code : "",
      class: "",
      subject: "",
      session_id: sessionId,
      user_type: name == "Admin" ? "Admin" : "Teacher",
    }
    let testIdData = {
      test_id: testId,
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You Won't able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        TestApi.deleteTestQuiz(testIdData)
          .then(res => {
            Swal.fire("Deleted!", res.data.msg, "success")
            TestApi.getAllTestQuiz(teacherCode)
              .then(res => {
                setTestdata(res.data)
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  const [TestActive, setTestActive] = useState(false)

  const ActiveInactive = async (TestActive, QuizId) => {
    let body = {
      test_id: QuizId,
      is_active: TestActive,
    }
    await ExamTestApi.ActiveInactiveExam(body).then(result => {
      console.log(result.data)
      // viewDraftQuestion()
      GetquizData()
    })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Container fluid={true}>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody className="border-bottom">
                    <div className="d-flex align-items-center">
                      <h1 className="mb-0 card-title flex-grow-1">Test/Quiz</h1>
                      <div className="flex-shrink-0">
                        {/* <Link to="/createtest" className="btn btn-primary me-1">
                          Create Test
                        </Link> */}
                        <Link
                          className="btn btn-primary me-1"
                          to="/exam/test/create"
                        >
                          Create Test
                        </Link>
                      </div>
                    </div>
                  </CardBody>
                  <CardBody>
                    <Row className="row justify-content-start">
                      <Col lg={12}>
                        <section className="row row-cols-lg-auto g-3 align-items-center">
                          <Col xs={12}>
                            <div className="form-check">
                              <label
                                className="form-check-label grow-1"
                                htmlFor="inlineFormCheck"
                              >
                                Class
                              </label>
                            </div>
                          </Col>
                          <Col xs={12}>
                            <select
                              className="form-select"
                              type="select"
                              name="class"
                              onChange={e => setF_class(e.target.value)}
                            >
                              <option value="">Select Class</option>
                              {name == "Admin"
                                ? classListOption?.map(class1 => (
                                    <option
                                      key={class1.value}
                                      value={class1.label}
                                    >
                                      {class1.label.toUpperCase()}
                                    </option>
                                  ))
                                : filterClassSectionList?.map(class1 => (
                                    <option
                                      key={class1.value}
                                      value={class1.label}
                                    >
                                      {class1.label.toUpperCase()}
                                    </option>
                                  ))}
                            </select>
                            {/* <select defaultValue="0" className="form-select">
                              <option>Select</option>
                              {classListOption?.map(sub => (
                                <option key={sub.value}>{sub.label}</option>
                              ))}
                            </select> */}
                          </Col>
                          <Col xs={12}>
                            <div className="form-check">
                              <Label
                                className="form-check-label grow-1"
                                htmlFor="inlineFormCheck"
                              >
                                Select Subject
                              </Label>
                            </div>
                          </Col>
                          <Col xs={12}>
                            <select
                              name="subject"
                              type="select"
                              className="form-select"
                              onChange={e => setF_subject(e.target.value)}
                            >
                              <option value="">Select Subject</option>
                              {name == "Admin"
                                ? teachersubject?.map((sub, index) => (
                                    <option
                                      key={index}
                                      value={sub.subject_name}
                                    >
                                      {sub.subject_name}
                                    </option>
                                  ))
                                : subject_list?.map((item, index) => (
                                    <option value={item.label} key={index}>
                                      {item?.label}
                                    </option>
                                  ))}
                            </select>
                            {/* <select defaultValue="0" className="form-select">
                              <option>Select</option>
                              {subjectListOption?.map(sub => (
                                <option key={sub.value}>{sub.label}</option>
                              ))}
                            </select> */}
                          </Col>
                        </section>
                      </Col>
                    </Row>
                  </CardBody>

                  <div className="bg-light border-rounded">
                    <Col xl={12}>
                      <Card>
                        <CardBody>
                          <CardTitle className="fs-6">Upcoming Test</CardTitle>

                          <Table
                            className="table table-striped"
                            id="table-to-xls"
                          >
                            <thead>
                              <tr>
                                <th>Test Name</th>
                                <th>Subject</th>
                                <th>Class</th>
                                <th>Date</th>
                                <th>Time Between</th>
                                <th>No. of Ques.</th>
                                <th>Duration</th>
                                <th>Action</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {testdata?.upcomming_test?.map(test => (
                                <tr key={test.id}>
                                  {/* {console.log(test)} */}
                                  <td className="text-start font-weight-bold">
                                    <Link to={`/edittest/${test.id}`}>
                                      {test.test_name}
                                    </Link>
                                  </td>
                                  <td>{test.subject}</td>
                                  <td>{test.st_class.toUpperCase()}</td>
                                  <td> {formatDate(test.start_date)}</td>
                                  <td>{test.test_startdatetime}</td>
                                  <td>{test.no_of_question} Ques.</td>
                                  <td>{test.duration} Min </td>
                                  <td>
                                    <div className="d-flex gap-3">
                                      <Link
                                        to={`/edittest/${test.id}`}
                                        className="text-success"
                                      >
                                        {/* <i
                                          className="mdi mdi-eye font-size-18"
                                          id="edittooltip"
                                        /> */}
                                        <i className="mdi mdi-pencil text-success font-size-18"></i>
                                      </Link>
                                      <Link
                                        to="#"
                                        className="text-danger"
                                        // onClick={() => {
                                        //   // onDelete(cir.id)
                                        // }}
                                        onClick={() => onTestDelete(test.id)}
                                      >
                                        <i
                                          className="mdi mdi-delete font-size-18"
                                          id="deletetooltip"
                                        />
                                      </Link>
                                      {/* Sarfaraz */}
                                    </div>{" "}
                                  </td>
                                  <td>
                                    <div className="square-switch d-flex">
                                      {/* <input
                                        type="checkbox"
                                        id="square-switch1"
                                        className="switch"
                                        // defaultChecked={TestActive}
                                        checked={test.is_active}
                                        onChange={() => {
                                          ActiveInactive(
                                            !test.is_active,
                                            test.id
                                          )
                                          setTestActive(!test.is_active)
                                        }}
                                      /> 
                                       <label
                                        htmlFor="square-switch1"
                                        data-on-label="*"
                                        data-off-label="x"
                                      /> */}
                                      <h6
                                        className={`text-center ${
                                          test.is_active
                                            ? "text-success"
                                            : "text-danger"
                                        } `}
                                      >
                                        {test.is_active ? "Active" : "Inactive"}
                                      </h6>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </Col>
                  </div>
                  <div className="border-rounded-10">
                    <Col lg={12}>
                      <Card>
                        <CardBody>
                          <CardTitle className="fs-6">Past Test</CardTitle>

                          <div className="table-responsive">
                            <Table
                              className="table table-striped"
                              id="table-to-xls"
                            >
                              <thead>
                                <tr>
                                  <th>Test Name</th>
                                  <th>Subject</th>
                                  <th>Class</th>
                                  <th>Date</th>
                                  <th>Time Between</th>
                                  <th>No. of Ques.</th>
                                  <th>Duration</th>
                                  <th>Action</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {testdata?.past_test?.map(test => (
                                  <tr key={test.id}>
                                    <td className="text-start font-weight-bold">
                                      {/* <Link to={`/edittest/${test.id}`}> */}
                                      <Link to={`/test-result/${test.id}`}>
                                        {test.test_name}
                                      </Link>
                                    </td>
                                    <td>{test.subject}</td>
                                    <td>{test.st_class.toUpperCase()}</td>
                                    <td> {formatDate(test.start_date)}</td>
                                    <td>{test.test_startdatetime}</td>
                                    <td>{test.no_of_question} Ques.</td>
                                    <td>{test.duration} Min</td>
                                    <td>
                                      <div className="d-flex gap-3">
                                        <Link
                                          to={`/edittest/${test.id}`}
                                          className="text-success"
                                        >
                                          {/* <i
                                          className="mdi mdi-eye font-size-18"
                                          id="edittooltip"
                                        /> */}
                                          <i className="mdi mdi-pencil text-success font-size-18"></i>
                                        </Link>
                                        {/* <Link
                                          to="/test5"
                                          className="text-success"
                                        >
                                          <i className="mdi mdi-eye text-success font-size-18"></i>
                                        </Link> */}
                                        <Link
                                          to="#"
                                          className="text-danger"
                                          onClick={() => onTestDelete(test.id)}
                                        >
                                          <i
                                            className="mdi mdi-delete font-size-18"
                                            id="deletetooltip"
                                          />
                                        </Link>
                                      </div>
                                    </td>
                                    <td>
                                      <h6
                                        className={` ${
                                          test.is_active
                                            ? "text-success"
                                            : "text-danger"
                                        } text-start`}
                                      >
                                        {test.is_active ? "Active" : "Inactive"}
                                      </h6>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </div>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  )
}

export default TestPage
