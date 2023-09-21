import React, { useContext, useEffect, useState } from "react"

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
} from "reactstrap"
import Breadcrumb from "components/Common/Breadcrumb"
import { TestApi } from "apis/TestApi"
import { useParams } from "react-router-dom"
import { SessionContext } from "context/sessionContext"
import Loading from "components/Loading"

function TestResult() {
  document.title = "Test Results"
  const { test_id } = useParams()
  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")
  const [loading, setLoading] = useState(false)
  const [quizinfo, setquizinfo] = useState({})
  const [Student, setStudent] = useState([])

  const getResult = async () => {
    setLoading(true)
    const body = {
      session_id: session,
      quiz_id: test_id,
    }
    await TestApi.getTestResult(body).then(res => {
      if (res.data.status === 200) {
        setquizinfo(res.data.quizinformation)
        setStudent(res.data.student)
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
          <div className="container-fluid">
            <Container fluid={true}>
              <Breadcrumb title={"Test Quiz"} breadcrumbItem="Result" />

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
                          value={quizinfo.test_name}
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
                          value={quizinfo.subject}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="">
                    <div className="">
                      <Row className="">
                        <Col lg={6}>
                          <tr className="ms-20">
                            <h6>
                              <p className="mb-0 mx-3">Exam Date : </p>
                            </h6>
                            <td>
                              <p className="mb-0 mx-3 ">{quizinfo.test_date}</p>
                            </td>
                          </tr>
                          <tr>
                            <h6>
                              <p className="mb-0 mx-3">Number of Ques. : </p>
                            </h6>
                            <td>
                              <p className="mb-0  mx-3">
                                {quizinfo.noofquestion} Questions
                              </p>
                            </td>
                          </tr>
                        </Col>
                        <Col lg={6}>
                          <tr>
                            <h6>
                              <p className="mb-0 mx-3">Test Duration : </p>
                            </h6>
                            <td>
                              <p className="mb-0 mx-3 ">
                                {quizinfo.duration} Minutes
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <h6>
                              <p className="mb-0 mx-3">Student Appeared : </p>
                            </h6>
                            <td>
                              <p className="mb-0 mx-3 ">
                                {quizinfo.present_count} Student
                              </p>
                            </td>
                          </tr>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Row>
                <div className="d-flex justify-content-center">
                  <Col lg={11}>
                    <Card>
                      <CardBody>
                        <div className="table-responsive">
                          <Table className="table mb-0">
                            <thead>
                              <tr className="fs-6 text-center">
                                <th>Sr. No</th>
                                <th>Roll No</th>
                                <th>Name</th>
                                <th>Attendance</th>
                                <th>Marks Obtained</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Student &&
                                Student.map(
                                  (
                                    {
                                      st_code,
                                      st_name,
                                      mark_obtain,
                                      attendance,
                                      stuquizid,
                                    },
                                    i
                                  ) => {
                                    return (
                                      <tr
                                        key={st_code}
                                        className="fs-6 text-center"
                                      >
                                        <td className="fs-6 center">{i + 1}</td>
                                        <td className="fs-6 center">
                                          {st_code}
                                        </td>
                                        <td className="fs-6">{st_name}</td>
                                        <td className="fs-6">{attendance}</td>
                                        <td>
                                          <h6 className="fs-5 text-primary">
                                            {mark_obtain}
                                            {stuquizid && (
                                              <a
                                                href={`/test-answer/${stuquizid}`}
                                              >
                                                <i
                                                  className={`far fa-eye text-success fs-6 mx-3`}
                                                ></i>
                                              </a>
                                            )}
                                          </h6>
                                        </td>
                                      </tr>
                                    )
                                  }
                                )}
                            </tbody>
                          </Table>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </div>
              </Row>
            </Container>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default TestResult
