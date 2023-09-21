import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import * as Yup from "yup"
import { useFormik } from "formik"
import Select from "react-select"
import { classApi } from "apis/ClassListApi"
import { TestApi } from "apis/TestApi"

import {
  Col,
  Row,
  Container,
  Modal,
  Form,
  Input,
  Label,
  Card,
  CardBody,
} from "reactstrap"

function EditTest() {
  //meta title
  document.title = "Edit Test"
  const [modal_standard, setmodal_standard] = useState(false)
  const [modal_backdrop, setmodal_backdrop] = useState(false)
  const [isopen, setisOpen] = useState(false)
  const [calender, setCalendar] = useState("")
  const [classList, setClassList] = useState([])
  const [Time, setTime] = useState("")
  const [testName, setTestName] = useState("")

  const [modal, setModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [subselected, setSubSelected] = useState([])
  const [selected, setSelected] = useState([])
  const [viewQuestion, setViewQuestion] = useState([])
  const [getTestQuestion, setGetTestQuestion] = useState([])
  const [show, setShow] = useState(false)
  const { test_id } = useParams()

  const [duration, setDuration] = useState([
    { value: "0", label: "30 minutes" },
    { value: "1", label: "45 Minutes" },
    { value: "2", label: "60 Minutes" },
  ])

  const [noOfQuestion, setNoOfQuestion] = useState([
    { value: "0", label: "20 Question" },
    { value: "1", label: "35 Question" },
    { value: "2", label: "45 Question" },
  ])

  async function tog_standard() {
    await TestApi.showTestQuestion({
      fk_questionid: id,
    })
      .then(resp => {
        setGetTestQuestion(resp.data.question)
      })
      .catch(err => {
        console.log(err)
      })

    setmodal_standard(!modal_standard)
    removeBodyCss()
  }
  console.log(getTestQuestion, "getTestQuestion")
  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }
  const handleOptionChange = event => {
    setSelectedOption(event.target.value)
  }
  const handleTestName = event => {
    setTestName(event.target.value)
  }

  const subhandleChange = selectedOption => {
    setSubSelected(selectedOption.value)
  }

  const durationChange = selectedOption => {
    setDuration(selectedOption.value)
  }

  const noOfQuestionChange = selectedOption => {
    setNoOfQuestion(selectedOption.value)
  }

  const handleChange = selectedOption => {
    setSelected(selectedOption.label)
  }

  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        setClassList(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    TestApi.ViewTestQuiz({
      test_id: test_id,
    })
      .then(resp => {
        setViewQuestion(resp.data.test)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const subjectListOption = classList?.subject?.map(sub => {
    return {
      value: sub.subject_code,
      label: sub.subject_name,
    }
  })

  const classListOption = classList?.section_list?.map(cl => {
    return {
      value: cl.UID,
      label: `${cl.st_class} ${cl.st_sec}`,
    }
  })
  const validationType = useFormik({
    enableReinitialize: true,
    initialValues: {
      st_class: selected,
      subject: subselected,
      test_name: getTestQuestion,
    },
    // validationSchema: Yup.object().shape({}),
    onSubmit: values => {
      console.log(values, "values")

      PostApi.createPost(data)
        .then(res => {
          console.log(res)
          if (res.data.status === 200) {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/post"
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
  })

  const handleSubmit = e => {
    e.preventDefault()
    setisSubmited(true)
  }

  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop)
    // removeBodyCss();
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Container fluid={true}>
            <Row>
              <Col lg="12">
                <Form
                  onSubmit={e => {
                    e.preventDefault()
                    validationType.handleSubmit()
                  }}
                >
                  <Card>
                    <CardBody className="border-bottom">
                      <div className="d-flex align-items-center">
                        <h1 className="mb-0 card-title flex-grow-1">
                          Edit Test/Quiz
                        </h1>
                      </div>
                    </CardBody>
                    <CardBody>
                      <Row className="mb-3 px-4">
                        <Col sm={9}>
                          <div className="hstack gap-0">
                            <label
                              htmlFor="example test input"
                              className="col-md-6 col-form-label"
                            >
                              <strong className="fs-6">Test Name :</strong>
                              <sapn
                                className="form-check-label"
                                style={{ marginLeft: "50px" }}
                              >
                                {viewQuestion[0]?.test_name}
                              </sapn>
                              <br />
                              <strong className="fs-6">Subjects :</strong>
                              <sapn
                                className="form-check-label"
                                style={{ marginLeft: "63px" }}
                              >
                                {viewQuestion[0]?.subject}
                              </sapn>
                              <br />
                              <strong className="fs-6">Duration :</strong>
                              <sapn
                                className="form-check-label"
                                style={{ marginLeft: "61px" }}
                              >
                                {viewQuestion[0]?.duration} Min
                              </sapn>
                              <br />
                              <strong className="fs-6">No. of Question:</strong>
                              <sapn
                                className="form-check-label"
                                style={{ marginLeft: "23px" }}
                              >
                                {viewQuestion[0]?.no_of_question}
                              </sapn>
                            </label>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>

                    {viewQuestion[0]?.question?.map((item, index) => (
                      <>
                        <Row className="mb-3" key={index}>
                          <label
                            htmlFor="example test input"
                            className="col-md-1 col-form-label"
                          >
                            <strong className="m-4">{++index}</strong>
                          </label>
                          <div className="col-md-9">
                            <Col lg={12}>
                              <div className="hstack gap-3">
                                <Input
                                  disabled
                                  className="form-control-auto"
                                  type="text"
                                  aria-label="Add your item here..."
                                  placeholder={item.question}
                                />

                                <i
                                  className="far fa-edit m-2"
                                  onClick={() => {
                                    tog_standard()
                                  }}
                                  // className="btn btn-primary "
                                  data-toggle="modal"
                                  data-target="#myModal"
                                ></i>
                                {/* <i className="far fa-trash-alt "></i> */}
                                <br />
                              </div>
                            </Col>
                            {/* ))} */}
                          </div>
                        </Row>

                        <div className="container">
                          <div className="col-sm-11 mx-auto">
                            {item?.option?.map((opt, id) => (
                              <label className="radio-inline ms-4" key={id}>
                                <input
                                  type="radio"
                                  name="season"
                                  id="seasonSummer"
                                  value="summer"
                                />{" "}
                                {opt.option}{" "}
                              </label>
                            ))}

                            <br></br>
                            <sapn style={{ marginLeft: "14px" }}>
                              Answer :{"  "}
                              {item?.que_answer?.map(
                                ({ fk_option__option }) => fk_option__option
                              )}
                            </sapn>
                            <br></br>
                          </div>
                        </div>
                      </>
                    ))}

                    <div className="container top-100">
                      <div className="row">
                        <div className="col text-center">
                          <div className="popup-container">
                            <div>
                              <button
                                type="button"
                                className="btn btn-primary "
                                onClick={() => {
                                  tog_backdrop()
                                }}
                                data-toggle="modal"
                              >
                                Generate Test
                              </button>
                              <Modal
                                isOpen={modal_standard}
                                toggle={() => {
                                  tog_standard()
                                }}
                              >
                                <Form
                                  // className="needs-validation"
                                  onSubmit={e => {
                                    e.preventDefault()
                                    validationType.handleSubmit()
                                  }}
                                >
                                  <div className="modal-header">
                                    {/* <h5
                                    className="modal-title mt-0"
                                    id="myModalLabel"
                                  >
                                    Modal Heading
                                  </h5> */}
                                  </div>
                                  <div className="modal-body">
                                    <label
                                      htmlFor="example test input"
                                      className="col-md-2 col-form-label"
                                    >
                                      <strong className="fs-6">
                                        Question{" "}
                                      </strong>
                                    </label>
                                    <Input
                                      name="test_name"
                                      placeholder="Question"
                                      type="text"
                                      className="form-control-auto"
                                      onChange={handleTestName}
                                      // onBlur={validationType.handleBlur}
                                      value={
                                        validationType.values.test_name || ""
                                      }
                                      // value={`${getTestQuestion[0]?.id}`}
                                      // invalid={
                                      //   validationType.touched.test_name &&
                                      //   validationType.errors.test_name
                                      //     ? true
                                      //     : false
                                      // }
                                    />
                                  </div>
                                  <label className="radio-inline ms-4">
                                    <input
                                      type="radio"
                                      name="season"
                                      id="seasonSummer"
                                      value="summer"
                                    />{" "}
                                    test{" "}
                                    <input
                                      type="radio"
                                      name="season"
                                      id="seasonSummer"
                                      className="radio-inline ms-4"
                                      value="summer"
                                    />{" "}
                                    test{" "}
                                    <input
                                      type="radio"
                                      name="season"
                                      id="seasonSummer"
                                      className="radio-inline ms-4"
                                      value="summer"
                                    />{" "}
                                    test{" "}
                                    <input
                                      type="radio"
                                      name="season"
                                      id="seasonSummer"
                                      className="radio-inline ms-4"
                                      value="summer"
                                    />{" "}
                                    test{" "}
                                  </label>
                                  <div className="modal-body">
                                    <label
                                      htmlFor="example test input"
                                      className="col-md-2 col-form-label"
                                    >
                                      <strong className="fs-6">Answer </strong>
                                    </label>

                                    <Input
                                      name="test_name"
                                      placeholder="Answer"
                                      type="text"
                                      className="form-control-auto"
                                      // onChange={validationType.handleChange}
                                      // onBlur={validationType.handleBlur}
                                      // value={validationType.values.test_name || ""}
                                      // invalid={
                                      //   validationType.touched.test_name &&
                                      //   validationType.errors.test_name
                                      //     ? true
                                      //     : false
                                      // }
                                    />
                                  </div>

                                  <div className="modal-footer">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        tog_standard()
                                      }}
                                      className="btn btn-secondary "
                                      data-dismiss="modal"
                                    >
                                      Close
                                    </button>
                                    <button
                                      type="submit"
                                      className="btn btn-primary "
                                    >
                                      Save changes
                                    </button>
                                  </div>
                                </Form>
                              </Modal>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  )
}

export default EditTest
