import React, { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import {
  Col,
  Row,
  Container,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  Button,
  FormFeedback,
  Label,
  CardTitle,
  Table,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap"
import { SessionContext } from "context/sessionContext"
import { TestApi } from "apis/TestApi"
import Breadcrumb from "components/Common/Breadcrumb"
import Loading from "components/Loading"

function TestAnswer() {
  document.title = "Student Test Result"
  const { st_code } = useParams()
  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")
  const [loading, setLoading] = useState(false)
  const [TestResult, setTestResult] = useState({})
  const [question, setquestion] = useState([])

  const getResult = async () => {
    setLoading(true)
    const body = {
      // session_id: session,
      // quiz_id: test_id,
      quiz_id: st_code,
    }
    await TestApi.getTestAnswer(body).then(res => {
      if (res.data.status === 200) {
        setTestResult(res.data.result)
        setquestion(res.data.question)
        console.log(res.data)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    getResult()
  }, [])

  return (
    <React.Fragment>
      {loading ? (
        <Loading />
      ) : (
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb title={"Test Quiz"} breadcrumbItem="Student Result" />
            <Card>
              <CardBody className="border-bottom">
                <div className="mt-3">
                  <Row className="mb-3">
                    <Col>
                      <h4 color="dark" className="fs-6">
                        Test Name
                      </h4>
                      <Input
                        disabled
                        className="form-control-auto "
                        type="text"
                        value={TestResult.test_name}
                      />
                    </Col>
                    <Col>
                      <h4 color="dark" className="fs-6">
                        Subject Name
                      </h4>
                      <Input
                        disabled
                        className="form-control-auto "
                        type="text"
                        value={TestResult.subject}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="">
                  <div className="table-borderless ">
                    <Row className="">
                      <Col lg={4}>
                        <tr className="ms-20">
                          <h6>
                            <p className="mb-0 mx-3">Exam Date : </p>
                          </h6>
                          <td>
                            <p className="mb-0 mx-3 ">{TestResult.test_date}</p>
                          </td>
                        </tr>
                        <tr>
                          <h6>
                            <p className="mb-0 mx-3">Roll Number : </p>
                          </h6>
                          <td>
                            <p className="mb-0 mx-3 ">{TestResult.st_code}</p>
                          </td>
                        </tr>
                      </Col>
                      <Col lg={4}>
                        <tr>
                          <h6>
                            <p className="mb-0 mx-3">Student Name : </p>
                          </h6>
                          <td>
                            <p className="mb-0 mx-3 ">{TestResult.st_name}</p>
                          </td>
                        </tr>
                        <tr>
                          <h6>
                            <p className="mb-0 mx-3">Marks Obtained : </p>
                          </h6>
                          <td>
                            <p className="mb-0  mx-3">
                              {TestResult.obtain_marks}
                            </p>
                          </td>
                        </tr>
                      </Col>
                      <Col lg={4}>
                        <tr>
                          <h6>
                            <p className="mb-0 mx-3">Attempt Ques. : </p>
                          </h6>
                          <td>
                            <p className="mb-0 mx-3 ">
                              {TestResult.attempt_que} out of{" "}
                              {TestResult.noofquestion}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <h6>
                            <p className="mb-0 mx-3">Unattempt : </p>
                          </h6>
                          <td>
                            <p className="mb-0 mx-3 ">
                              {TestResult.unattempt_que} Ques.
                            </p>
                          </td>
                        </tr>
                      </Col>
                    </Row>
                  </div>
                </div>
              </CardBody>
            </Card>

            {question &&
              question.map(({ id, question, option }, i) => {
                return (
                  <>
                    <Row className="mb-3" key={id}>
                      <label
                        htmlFor="example test input"
                        className="col-md-1 col-form-label"
                      >
                        <strong className="m-5">{i + 1}.</strong>
                      </label>
                      <div className="col-md-10">
                        <Col lg={12}>
                          <div className="hstack gap-3">
                            <Input
                              className="form-control-auto"
                              type="text"
                              value={question}
                              style={{ fontWeight: "bold" }}
                            />
                            {option &&
                              option.map(
                                (
                                  { option, correct_answer, student_answer },
                                  i
                                ) => {
                                  return correct_answer === "False" &&
                                    student_answer === "True" ? (
                                    <i
                                      className={`far fa-times-circle text-danger fs-4`}
                                    ></i>
                                  ) : (
                                    correct_answer === student_answer && (
                                      <i
                                        className={`fas fa-check-circle text-success fs-4`}
                                      ></i>
                                    )
                                  )
                                }
                              )}
                          </div>
                        </Col>
                      </div>
                    </Row>

                    <div className="col-lg-10 m-2 px-5">
                      {option &&
                        option.map(
                          ({ option, correct_answer, student_answer }, i) => {
                            return (
                              <>
                                <label
                                  className="radio-inline ms-5 ml-10"
                                  key={id}
                                >
                                  {i + 1}
                                  {`) `}
                                  {option}
                                </label>
                                <i
                                  className={
                                    correct_answer === student_answer
                                      ? `fas fa-check text-success fs-4 mx-3`
                                      : null
                                  }
                                ></i>
                                {correct_answer === "False" &&
                                student_answer === "True" ? (
                                  <i
                                    className={`far fa-times-circle text-danger fs-4 mx-3`}
                                  ></i>
                                ) : null}
                                <br />
                              </>
                            )
                          }
                        )}
                    </div>
                    {option &&
                      option.map(
                        ({ option, correct_answer, student_answer }, i) => {
                          return (
                            <>
                              {correct_answer === "True" ? (
                                <div className="mx-5 mb-4 px-5">
                                  <strong className="mx-2 text-success">
                                    Answer :{" "}
                                  </strong>{" "}
                                  <strong className="mx-2 text-success">
                                    {option}
                                  </strong>
                                </div>
                              ) : null}
                            </>
                          )
                        }
                      )}
                  </>
                )
              })}
          </Container>
        </div>
      )}
    </React.Fragment>
  )
}

export default TestAnswer
