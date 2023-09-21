import { classApi } from "apis/ClassListApi"
import { ExamTestApi } from "apis/ExamTestAPI"
import { TestApi } from "apis/TestApi"
import config from "config/config"
import { useFormik } from "formik"
import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  Col,
  FormFeedback,
  Input,
  Row,
} from "reactstrap"
import * as Yup from "yup"
import { SessionContext } from "context/sessionContext"
import moment from "moment"
import Swal from "sweetalert2"

const TestEditPage = () => {
  const { test_id } = useParams()
  const [user, setUserLogged] = useState(
    JSON.parse(localStorage.getItem("User"))
  )
  const { Session } = useContext(SessionContext)
  let sessionId = Session || sessionStorage.getItem("SessionId")

  const [Disabled, setDisabled] = useState(false)
  const [duration, setDuration] = useState([])
  const [noOfQuestion, setNoOfQuestion] = useState([])
  const [classList, setClassList] = useState([])
  const [classSectionListOption, setClassSectionListOption] = useState([])
  const [QuizId, setQuizId] = useState("")
  const [selectedOption, setSelectedOption] = useState(null)
  const [singleChoice, setSingleChoice] = useState(false)
  const [trueFalseValid, setTrueFalseValid] = useState(false)
  const [fileIBValid, setfileIBValid] = useState(false)
  const [op1valid, setOp1valid] = useState(null)
  const [op2valid, setOp2valid] = useState(null)
  const [op3valid, setOp3valid] = useState(null)
  const [op4valid, setOp4valid] = useState(null)
  const [fop1valid, setfOp1valid] = useState(false)
  const [fop2valid, setfOp2valid] = useState(false)
  const [fop3valid, setfOp3valid] = useState(false)
  const [fop4valid, setfOp4valid] = useState(false)

  let [one, set1] = useState()
  let [two, set2] = useState()
  let [three, set3] = useState()
  let [four, set4] = useState()
  const [arr, setarr] = useState([])

  const [fileData, setFileData] = useState("")
  const [Answer, setAnswer] = useState("")

  const [question, setquestion] = useState("")
  const [TestActive, setTestActive] = useState(false)
  const [editTestQuiz, setEditTestQuiz] = useState(false)

  const [ViewQuestion, setViewQuestion] = useState([])
  const [questionCount, setQuestionCount] = useState(0)
  const [questions, setquestions] = useState({})
  const [viewQuestion, setviewQuestion] = useState([])
  const [OptionImage, setOptionImage] = useState(false)
  const [arrayIndex, setArrayIndex] = useState(0)
  const [st_class, setst_class] = useState("")
  const [subject, setsubject] = useState("")
  const [teachersubject, setTeacherSubject] = useState([])
  const [classListOption, setClassListOption] = useState([])

  const handleOptionChange = event => {
    setAnswer(event.target.value)
  }

  const handleFileRead = async event => {
    const file = event.target.files[0]
    const base64 = await convertBase64(file)
    setFileData(base64.split("base64,")[1])
  }

  const optionFileRead = async event => {
    const file = event.target.files[0]
    if (file.size <= 524288) {
      // console.log(file.size)
      const base64 = await convertBase64(file)
      arr.push(base64.split("base64,")[1])
      setOptionImage(true)
    } else {
      Swal.fire({
        text: "Please select less than 500kb image",
        icon: "warning",
        imageAlt: "warning image",
      }).then(e => {
        if (!op1valid) {
          setOp1valid("")
          // setfOp1valid(false)
        } else if (!op2valid) {
          setOp2valid("")
          // setfOp2valid(false)
        } else if (!op3valid) {
          setOp3valid("")
          // setfOp3valid(false)
        } else if (!op4valid) {
          setOp4valid("")
          // setfOp4valid(false)
        }
      })
    }
  }

  const convertBase64 = file => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = error => {
        reject(error)
      }
    })
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
        setviewQuestion(resp.data.test)
        console.log(resp.data.test)
        setst_class(resp.data.test[0]?.st_class)
        setsubject(resp.data.test[0]?.subject)
      })
      .catch(err => {
        console.log(err)
      })
  }, [editTestQuiz])

  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        setClassList(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    if (user != "Admin") {
      setClassSectionListOption(
        user?.teacher_subject?.map(cl => {
          return {
            value: cl.uid,
            label: `${cl.st_class} ${cl.st_sec}`,
          }
        })
      )
    }
  }, [])
  let suboption = user?.teacher_subject
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

  let filterClassSectionList = classSectionListOption?.filter(
    (list, index, arr) => {
      return index === arr.findIndex(d => d.label === list.label)
    }
  )

  useEffect(() => {
    TestApi.getTestDuration()
      .then(res => {
        setDuration(
          res.data?.testduration?.map(due => {
            return {
              value: due.id,
              label: due.duration,
            }
          })
        )
      })
      .catch(err => console.log(err.message))
  }, [])

  let DateTime = new Date(viewQuestion[0]?.start_date)
  const validationType = useFormik({
    enableReinitialize: true,
    initialValues: {
      quiz_id: test_id,
      teacher_code: user?.payload?.t_code ? user?.payload?.t_code : "",
      session_id: sessionId,
      test_name: viewQuestion[0]?.test_name,
      st_class: st_class || viewQuestion[0]?.st_class,
      subject: subject || viewQuestion[0]?.subject,
      duration: viewQuestion[0]?.duration,
      no_of_question: viewQuestion[0]?.no_of_question,
      date: moment(DateTime).format("YYYY-MM-DD"),
      added_by: user == "Admin" ? "Admin" : "Teacher",
      time: moment(DateTime).format("hh:mm"),
    },
    validationSchema: Yup.object().shape({
      // teacher_code: Yup.string().required("This is required"),
      session_id: Yup.string().required("This is required"),
      test_name: Yup.string().required("This is required"),
      st_class: Yup.string().required("This is required"),
      subject: Yup.string().required("This is required"),
      duration: Yup.string().required("This is required"),
      no_of_question: Yup.string().required("This is required"),
      date: Yup.string().required("This is required"),
      added_by: Yup.string().required("This is required"),
      time: Yup.string().required("This is required"),
    }),
    onSubmit: values => {
      // console.log(values, "values")
      ExamTestApi.updateExamTestQuiz(values).then(result => {
        console.log(result.data.quiz_id)
        setQuizId(result.data.quiz_id)
        setEditTestQuiz(false)
        viewDraftQuestion()
      })
    },
  })

  const AddQuestion = useFormik({
    enableReinitialize: true,
    initialValues: {
      quiz_id: test_id,
      answer_index: arrayIndex,
      question: question,
      media: fileData,
      single_choice: singleChoice ? "True" : "False",
      fillinblanks: fileIBValid ? "True" : "False",
      true_false: trueFalseValid ? "True" : "False",
      option_media: OptionImage ? "True" : "False",
      option: [],
      // option: arr.length === 4 || arr.length === 2 ? arr : [one, two, three, four],
      answer: Answer,
    },
    validationSchema: Yup.object().shape({
      quiz_id: Yup.string().required("This is required"),
      // answer_index: Yup.string().required("This is required"),
      question: Yup.string().required("This is required"),
      // media: OptionImage && Yup.mixed().required("This is required"),
      single_choice: Yup.string().required("This is required"),
      fillinblanks: Yup.string().required("This is required"),
      true_false: Yup.string().required("This is required"),
      // option_media: Yup.string().required("This is required"),
      // option: Yup.string().required("This is required"),
      answer: Yup.string().required("This is required"),
    }),
    onSubmit: values => {
      if (values.option === []) {
        console.log(values.option, "option")
        Swal.fire({
          text: "All option required",
          icon: "warning",
          imageAlt: "warning image",
        }).then(e => {
          console.log("All option required")
        })
      } else if (one && two && three && four) {
        console.log(one, two, three, four)
        values.option = [one, two, three, four]
        ExamTestApi.createExamTestQuestion(values).then(result => {
          if (result.data.status === 403) {
            Swal.fire({
              text: result.data.msg,
              icon: "warning",
              imageAlt: "warning image",
            }).then(e => {
              console.log("All option required")
            })
          } else {
            console.log(result.data)
            viewDraftQuestion()
            setQuestionCount(Number(result.data.question_count))
            setquestions(result.data)
            setquestion("")
            setFileData("")
            setarr([])
            setAnswer("")
            setOp1valid("")
            setOp2valid("")
            setOp3valid("")
            setOp4valid("")
            setOptionImage(false)
            setArrayIndex(0)
            set1()
            set2()
            set3()
            set4()
          }
        })
      } else if (arr.length === 4 || arr.length === 2) {
        console.log(arr.length)
        values.option = arr
        ExamTestApi.createExamTestQuestion(values).then(result => {
          if (result.data.status === 403) {
            Swal.fire({
              // text: "All option required",
              text: result.data.msg,
              icon: "warning",
              imageAlt: "warning image",
            }).then(e => {
              console.log("All option required")
            })
          } else {
            console.log(result.data)
            viewDraftQuestion()
            setQuestionCount(Number(result.data.question_count))
            setquestions(result.data)
            setquestion("")
            setFileData("")
            setarr([])
            setAnswer("")
            setOp1valid("")
            setOp2valid("")
            setOp3valid("")
            setOp4valid("")
            setOptionImage(false)
            setArrayIndex(0)
            set1()
            set2()
            set3()
            set4()
          }
        })
      } else {
        Swal.fire({
          text: "All option required",
          icon: "warning",
          imageAlt: "warning image",
        }).then(e => {
          console.log("All option required")
        })
      }
    },
    // onSubmit: values => {
    //   console.log(values, "values")
    //   ExamTestApi.createExamTestQuestion(values).then(result => {
    //     console.log(result.data)
    //     setQuestionCount(Number(result.data.question_count))
    //     setquestions(result.data)
    //     setquestion("")
    //     setFileData("")
    //     setarr([])
    //     setAnswer("")
    //     setOp1valid("")
    //     setOp2valid("")
    //     setOp3valid("")
    //     setOp4valid("")
    //     setOptionImage(false)
    //     setArrayIndex(null)
    //     viewDraftQuestion()
    //     set1()
    //     set2()
    //     set3()
    //     set4()
    //   })
    // },
  })

  const viewDraftQuestion = async () => {
    let body = {
      test_id: test_id,
    }
    await ExamTestApi.viewExamTestQuestion(body).then(result => {
      console.log(result.data.test[0].question)
      setViewQuestion(result.data.test[0].question)
      setTestActive(result.data.test[0].is_active)
    })
  }

  useEffect(() => {
    viewDraftQuestion()
  }, [editTestQuiz])

  const deleteQuestion = async (id, fk_test_id) => {
    let body = {
      question_id: id,
      quiz_id: fk_test_id,
    }

    await ExamTestApi.deleteExamTestQuestion(body).then(result => {
      console.log(result.data)
      setQuestionCount(Number(result.data.question_count))
      viewDraftQuestion()
    })
  }

  const ActiveInactive = async TestActive => {
    let body = {
      test_id: test_id,
      is_active: TestActive,
    }
    await ExamTestApi.ActiveInactiveExam(body).then(result => {
      console.log(result.data)
      viewDraftQuestion()
    })
  }

  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        setClassList(res.data)
        if (user == "Admin") {
          setClassListOption(
            res?.data?.section_list?.map(cl => {
              return {
                value: cl.UID,
                label: `${cl.st_class} ${cl.st_sec}`,
              }
            })
          )

          // setTeacherSubject([])
        }
        if (user != "Admin") {
          setClassSectionListOption(
            user?.teacher_subject?.map(cl => {
              return {
                value: cl.uid,
                label: `${cl.st_class} ${cl.st_sec}`,
              }
            })
          )
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [st_class])

  const str = st_class
  const parts = str?.split(" ")
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
        console.log(res.data.subject)
      })
      .catch(err => {
        console.log(err)
      })
  }, [sel_class, sel_section])

  const handleClear = () => {
    AddQuestion.resetForm()
    setquestion("")
    setFileData("")
    setarr([])
    setAnswer("")
    setOp1valid("")
    setOp2valid("")
    setOp3valid("")
    setOp4valid("")
    setOptionImage(false)
    setArrayIndex(0)
    set1()
    set2()
    set3()
    set4()
  }

  return (
    <>
      <div className="container p-5 mt-5">
        <Card>
          <CardBody className="border-bottom">
            <div className="d-flex align-items-center">
              <h1 className="m-0 card-title flex-grow-1">Edit Test/Quiz</h1>
              <a href="/test" className="btn btn-info">
                Go Back
              </a>
              <div className="square-switch d-flex pt-2 px-2">
                <input
                  type="checkbox"
                  id="square-switch1"
                  className="switch"
                  // defaultChecked={TestActive}
                  checked={TestActive}
                  onClick={() => {
                    setTestActive(!TestActive)
                    ActiveInactive(!TestActive)
                  }}
                />
                <label
                  htmlFor="square-switch1"
                  data-on-label="*"
                  data-off-label="x"
                />
                <h6
                  className={`mt-1 ${
                    TestActive ? "text-success" : "text-danger"
                  } mx-2`}
                >
                  {TestActive ? "Active" : "Inactive"}
                </h6>
              </div>
            </div>
          </CardBody>

          <CardBody>
            <Row className="px-2">
              <Col sm={12}>
                {editTestQuiz ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      validationType.handleSubmit()
                    }}
                  >
                    <div className="card-body">
                      <div className="mb-3 px-4 row">
                        <div className="col-sm-9">
                          <div className="hstack gap-0">
                            <label
                              htmlFor="example test input"
                              className="col-md-2 col-form-label"
                            >
                              <strong className="fs-6">Test Name </strong>
                            </label>
                            <div className="col-md-10">
                              <input
                                // disabled={Disabled}
                                name="test_name"
                                placeholder="Enter Test Name"
                                type="text"
                                className="form-control-auto form-control"
                                aria-invalid="false"
                                onChange={validationType.handleChange}
                                onBlur={validationType.handleBlur}
                                value={validationType.values.test_name || ""}
                              />
                              {validationType.touched.test_name &&
                              validationType.errors.test_name ? (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "11px",
                                    marginTop: "3px",
                                  }}
                                >
                                  This is required
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="mb-3 row">
                          <div className="col-sm-3">
                            <div className="mb-3 form-check">
                              <label className="form-label form-label">
                                Class
                              </label>
                              <select
                                // disabled={Disabled}
                                name="st_class"
                                type="select"
                                className="form-select"
                                onChange={e => {
                                  setst_class(e.target.value)
                                  validationType.handleChange
                                }}
                                onBlur={validationType.handleBlur}
                                value={validationType.values.st_class}
                              >
                                <option value="">Select Class</option>
                                {user == "Admin"
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
                                {/* {filterClassSectionList?.map(class1 => (
                                  <option
                                    key={class1.value}
                                    value={class1.label}
                                  >
                                    {class1.label.toUpperCase()}
                                  </option>
                                ))} */}
                              </select>
                              {validationType.touched.st_class &&
                              validationType.errors.st_class ? (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "11px",
                                    marginTop: "3px",
                                  }}
                                >
                                  This is required
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="mb-3 form-check">
                              <label className="form-label form-label">
                                Subjects
                              </label>
                              <select
                                // disabled={Disabled}
                                name="subject"
                                type="select"
                                className="form-select"
                                onChange={e => {
                                  setsubject(e.target.value),
                                    validationType.handleChange
                                }}
                                onBlur={validationType.handleBlur}
                                value={validationType.values.subject}
                              >
                                <option value="">Select Subject</option>
                                {user == "Admin"
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
                                {/* {subject_list?.map((item, index) => (
                                  <option value={item.label} key={index}>
                                    {item?.label}
                                  </option>
                                ))} */}
                              </select>
                              {validationType.touched.subject &&
                              validationType.errors.subject ? (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "11px",
                                    marginTop: "3px",
                                  }}
                                >
                                  This is required
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="mb-3 form-check">
                              <label className="form-label form-label">
                                No. of Questions
                              </label>

                              <input
                                // disabled={Disabled}
                                name="no_of_question"
                                placeholder="No. of Questions"
                                type="number"
                                className="form-control-auto form-control"
                                aria-invalid="false"
                                onChange={validationType.handleChange}
                                onBlur={validationType.handleBlur}
                                value={
                                  validationType.values.no_of_question || ""
                                }
                                min="1"
                                max="30"
                              />
                              {validationType.touched.no_of_question &&
                              validationType.errors.no_of_question ? (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "11px",
                                    marginTop: "3px",
                                  }}
                                >
                                  {validationType.errors.no_of_question}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="mb-3 form-check">
                              <label className="form-label form-label">
                                Duration (Minutes)
                              </label>
                              <select
                                // disabled={Disabled}
                                name="duration"
                                type="select"
                                className="form-select"
                                onChange={validationType.handleChange}
                                onBlur={validationType.handleBlur}
                                value={validationType.values.duration || ""}
                              >
                                <option value="">Select Duration</option>
                                {duration?.map((item, index) => (
                                  <option value={item.label} key={index}>
                                    {item?.label}
                                  </option>
                                ))}
                              </select>
                              {validationType.touched.duration &&
                              validationType.errors.duration ? (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "11px",
                                    marginTop: "3px",
                                  }}
                                >
                                  {validationType.errors.duration}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="mb-3 form-check">
                              <label className="form-label form-label">
                                Date
                              </label>
                              <input
                                // disabled={Disabled}

                                name="date"
                                placeholder="Select Date"
                                type="date"
                                className="form-control-auto form-control"
                                value={validationType.values.date || ""}
                                onChange={validationType.handleChange}
                                onBlur={validationType.handleBlur}
                              />
                              {validationType.touched.date &&
                              validationType.errors.date ? (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "11px",
                                    marginTop: "3px",
                                  }}
                                >
                                  {validationType.errors.date}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-sm-3">
                            <div className="mb-3 form-check">
                              <label className="form-label form-label">
                                Time
                              </label>
                              <input
                                // disabled={Disabled}
                                name="time"
                                type="time"
                                className="form-control form-control"
                                value={validationType.values.time || ""}
                                onChange={validationType.handleChange}
                                onBlur={validationType.handleBlur}
                              />
                              {validationType.touched.time &&
                              validationType.errors.time ? (
                                <div
                                  style={{
                                    color: "#f46a6a",
                                    fontSize: "11px",
                                    marginTop: "3px",
                                  }}
                                >
                                  {validationType.errors.time}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div
                            className={`${Disabled ? "d-none" : ""} col-sm-3`}
                          >
                            <div className="mt-4 form-check">
                              <div className="d-flex flex-wrap gap-2">
                                <button
                                  type="submit"
                                  className="btn  btn btn-primary"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <Row>
                    <Col sm={4}>
                      <div className="m-2">
                        <strong className="">Test Name :</strong>
                        <sapn
                          className="form-check-label"
                          style={{ marginLeft: "30px" }}
                        >
                          {viewQuestion[0]?.test_name}
                        </sapn>
                      </div>
                      <div className="m-2">
                        <strong className="">Subjects :</strong>
                        <sapn
                          className="form-check-label"
                          style={{ marginLeft: "43px" }}
                        >
                          {viewQuestion[0]?.subject}
                        </sapn>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="m-2">
                        <strong className="">Question :</strong>
                        <sapn
                          className="form-check-label"
                          style={{ marginLeft: "23px" }}
                        >
                          {viewQuestion[0]?.no_of_question} Question
                        </sapn>
                      </div>
                      <div className="m-2">
                        <strong className="">Time :</strong>
                        <sapn
                          className="form-check-label"
                          style={{ marginLeft: "27px" }}
                        >
                          {viewQuestion[0]?.test_startdatetime}
                        </sapn>
                      </div>
                    </Col>
                    <Col sm={3}>
                      <div className="m-2">
                        <strong className="">Class :</strong>
                        <sapn
                          className="form-check-label"
                          style={{ marginLeft: "63px" }}
                        >
                          {viewQuestion[0]?.st_class.toUpperCase()}
                        </sapn>
                      </div>
                      <div className="m-2">
                        <strong className="">Duration :</strong>
                        <sapn
                          className="form-check-label"
                          style={{ marginLeft: "42px" }}
                        >
                          {viewQuestion[0]?.duration} Min
                        </sapn>
                      </div>
                    </Col>
                    <Col sm={1}>
                      <a onClick={() => setEditTestQuiz(!editTestQuiz)}>
                        <i className="fa fa-edit text-success font-size-16"></i>
                      </a>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>

        {!Disabled ? (
          <div className="bg-white">
            <form
              onSubmit={e => {
                e.preventDefault()
                AddQuestion.handleSubmit()
              }}
            >
              <div className="border border-black bg-white">
                <div className="container">
                  <div className="form-inline py-2">
                    <label
                      htmlFor="example test input"
                      className="col-md-2 col-form-label"
                    >
                      <strong className="grow-1 mx-3 row-md-8">
                        Question Types
                      </strong>
                    </label>
                    <input
                      type="radio"
                      name="single_choice"
                      value={AddQuestion.values.single_choice || "option1"}
                      checked={selectedOption === "option1"}
                      className="mx-md-3"
                      onChange={AddQuestion.handleChange}
                      onBlur={AddQuestion.handleBlur}
                      onClick={() => {
                        setSelectedOption("option1")
                        setSingleChoice(true),
                          setTrueFalseValid(false),
                          setfileIBValid(false)
                      }}
                      id="contactChoice1"
                    />
                    <label className="col pe-md-5" htmlFor="contactChoice1">
                      <p className="fs-6">Single Choice</p>
                    </label>

                    <input
                      name="true_false"
                      value={AddQuestion.values.true_false || "option2"}
                      type="radio"
                      id="contactChoice1"
                      className="mx-md-3"
                      checked={selectedOption === "option2"}
                      onChange={AddQuestion.handleChange}
                      onBlur={AddQuestion.handleBlur}
                      onClick={() => {
                        setSelectedOption("option2")
                        setSingleChoice(false),
                          setTrueFalseValid(true),
                          setfileIBValid(false)
                      }}
                    />
                    <label className="col pe-md-5" htmlFor="contactChoice1">
                      <p className="fs-6">True or False</p>
                    </label>

                    <input
                      type="radio"
                      name="fillinblanks"
                      value={AddQuestion.values.fillinblanks || "option3"}
                      checked={selectedOption === "option3"}
                      id="contactChoice1"
                      className="mx-md-3"
                      onChange={AddQuestion.handleChange}
                      onBlur={AddQuestion.handleBlur}
                      onClick={() => {
                        setSelectedOption("option3")
                        setSingleChoice(false),
                          setTrueFalseValid(false),
                          setfileIBValid(true)
                      }}
                    />
                    <label className="col pe-md-5" htmlFor="contactChoice1">
                      <p className="fs-6">Fill In The Blanks</p>
                    </label>

                    <label
                      className="float-end col mt-3"
                      htmlFor="contactChoice1"
                    >
                      <p className="fs-6">
                        {/* {validationType.values.no_of_question >=
                        Number(questionCount + 1)
                          ? Number(questionCount + 1) +
                            "/" +
                            validationType.values.no_of_question
                          : ""} */}
                      </p>
                    </label>
                  </div>
                </div>
                {selectedOption === "option1" && (
                  <div className="option1">
                    <Row className="mb-3">
                      <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                      >
                        <h5 className="ms-5 my-control">Question</h5>
                      </label>
                      <div className="col-md-10">
                        <Input
                          name="question"
                          rows="2"
                          placeholder="Write your Question"
                          type="textarea"
                          className="form-control"
                          value={question}
                          onChange={e => setquestion(e.target.value)}
                          style={{ width: "794px" }}
                          invalid={
                            AddQuestion.touched.question &&
                            AddQuestion.errors.question
                              ? true
                              : false
                          }
                        />
                        {AddQuestion.touched.question &&
                        AddQuestion.errors.question ? (
                          <FormFeedback type="invalid">
                            {AddQuestion.errors.question}
                          </FormFeedback>
                        ) : null}
                        <br />
                        <label htmlFor="img">
                          <h6>Upload Image</h6>
                        </label>
                        <div className="col-md-10">
                          <Col lg={12}>
                            <Input
                              type="file"
                              className="form-control me-auto"
                              id="img"
                              name="media"
                              style={{ width: "794px" }}
                              accept="image/*"
                              onChange={e => handleFileRead(e)}
                              valid={fileData}
                              invalid={
                                AddQuestion.touched.media &&
                                AddQuestion.errors.media
                                  ? true
                                  : false
                              }
                            />
                          </Col>
                        </div>
                        {AddQuestion.touched.media &&
                        AddQuestion.errors.media ? (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            <span>This is required</span>
                          </div>
                        ) : null}
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                      >
                        <h5 className="ms-5 my-control">Option</h5>
                      </label>
                      <div className="col-md-10">
                        <Col lg={11}>
                          <div className="hstack gap-3">
                            {fop1valid ? (
                              <Input
                                type="file"
                                className="form-control me-auto"
                                id="img"
                                accept="image/*"
                                name="op1"
                                value={op1valid}
                                onChange={e => {
                                  setOp1valid(e.target.value),
                                    optionFileRead(e),
                                    setfOp1valid(true)
                                }}
                              />
                            ) : (
                              <Input
                                className="form-control me-auto"
                                type="text"
                                name="op1"
                                value={op1valid}
                                onChange={e => {
                                  setOp1valid(e.target.value),
                                    set1(e.target.value)
                                }}
                                // onChange={e => setOp1valid(e.target.value)}
                                // onBlur={() => arr.push(op1valid)}
                                placeholder="Option"
                                aria-label=""
                              />
                            )}
                            <i
                              className="far fa-image"
                              onClick={() => setfOp1valid(!fop1valid)}
                            ></i>
                            <input
                              type="radio"
                              name="answer"
                              onClick={handleOptionChange}
                              checked={Answer === op1valid}
                              value={op1valid}
                              onBlur={() => setArrayIndex(0)}
                            />{" "}
                            Correct
                            <br />
                          </div>
                        </Col>
                        <br />

                        <Col lg={11}>
                          <div className="hstack gap-3">
                            {fop2valid ? (
                              <Input
                                type="file"
                                className="form-control me-auto"
                                id="img"
                                accept="image/*"
                                name="op2"
                                value={op2valid}
                                onChange={e => {
                                  setOp2valid(e.target.value),
                                    optionFileRead(e),
                                    setfOp2valid(true)
                                }}
                              />
                            ) : (
                              <Input
                                className="form-control me-auto"
                                type="text"
                                name="op2"
                                value={op2valid}
                                onChange={e => {
                                  setOp2valid(e.target.value),
                                    set2(e.target.value)
                                }}
                                // onChange={e => setOp2valid(e.target.value)}
                                // onBlur={() => arr.push(op2valid)}
                                placeholder="Option"
                                aria-label=""
                              />
                            )}
                            <i
                              className="far fa-image"
                              onClick={() => setfOp2valid(!fop2valid)}
                            ></i>
                            <input
                              type="radio"
                              name="answer"
                              onClick={handleOptionChange}
                              checked={Answer === op2valid}
                              value={op2valid}
                              onBlur={() => setArrayIndex(1)}
                            />{" "}
                            Correct
                            <br />
                          </div>
                        </Col>
                        <br />

                        <Col lg={11}>
                          <div className="hstack gap-3">
                            {fop3valid ? (
                              <Input
                                type="file"
                                className="form-control me-auto"
                                id="img"
                                accept="image/*"
                                name="op3"
                                value={op3valid}
                                onChange={e => {
                                  setOp3valid(e.target.value),
                                    optionFileRead(e),
                                    setfOp3valid(true)
                                }}
                              />
                            ) : (
                              <Input
                                className="form-control me-auto"
                                type="text"
                                name="op3"
                                value={op3valid}
                                onChange={e => {
                                  setOp3valid(e.target.value),
                                    set3(e.target.value)
                                }}
                                // onChange={e => setOp3valid(e.target.value)}
                                // onBlur={() => arr.push(op3valid)}
                                placeholder="Option"
                                aria-label=""
                              />
                            )}
                            <i
                              className="far fa-image"
                              onClick={() => setfOp3valid(!fop3valid)}
                            ></i>
                            <input
                              type="radio"
                              name="answer"
                              onClick={handleOptionChange}
                              checked={Answer === op3valid}
                              value={op3valid}
                              onBlur={() => setArrayIndex(2)}
                            />{" "}
                            Correct
                            <br />
                          </div>
                        </Col>
                        <br />

                        <Col lg={11}>
                          <div className="hstack gap-3">
                            {fop4valid ? (
                              <Input
                                type="file"
                                className="form-control me-auto"
                                id="img"
                                accept="image/*"
                                name="op4"
                                value={op4valid}
                                onChange={e => {
                                  setOp4valid(e.target.value),
                                    optionFileRead(e),
                                    setfOp4valid(true)
                                }}
                              />
                            ) : (
                              <Input
                                className="form-control me-auto"
                                type="text"
                                name="op4"
                                value={op4valid}
                                onChange={e => {
                                  setOp4valid(e.target.value),
                                    set4(e.target.value)
                                }}
                                // onChange={e => setOp4valid(e.target.value)}
                                // onBlur={() => arr.push(op4valid)}
                                placeholder="Option"
                                aria-label=""
                              />
                            )}
                            <i
                              className="far fa-image"
                              onClick={() => setfOp4valid(!fop4valid)}
                            ></i>
                            <input
                              type="radio"
                              name="answer"
                              onClick={handleOptionChange}
                              checked={Answer === op4valid}
                              value={op4valid}
                              onBlur={() => setArrayIndex(3)}
                            />
                            Correct
                            <br />
                          </div>
                        </Col>
                        {AddQuestion.touched.answer &&
                        AddQuestion.errors.answer ? (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                              float: "right",
                            }}
                          >
                            Choose Correct Option
                          </div>
                        ) : null}
                        <br />

                        <Button
                          type="submit"
                          className="btn btn-primary me-1  "
                          id="ExampleTrigger"
                        >
                          ADD SINGLE CHOICE QUESTION
                        </Button>
                        <a
                          onClick={() => handleClear()}
                          className="btn btn-danger mx-1"
                        >
                          Clear
                        </a>
                        {/* {validationType.values.no_of_question >=
                        Number(questionCount + 1) ? (
                          <Button
                            type="submit"
                            className="btn btn-primary me-1  "
                            id="ExampleTrigger"
                          >
                            ADD SINGLE QUESTION
                          </Button>
                        ) : (
                          <div className="square-switch d-flex">
                            <input
                              type="checkbox"
                              id="square-switch1"
                              className="switch"
                              // defaultChecked={TestActive}
                              checked={TestActive}
                              onChange={() => {
                                ActiveInactive(!TestActive)
                                setTestActive(!TestActive)
                              }}
                            />
                            <label
                              htmlFor="square-switch1"
                              data-on-label="*"
                              data-off-label="x"
                            />
                            <h6
                              className={`${
                                TestActive ? "text-success" : "text-danger"
                              } mx-2`}
                            >
                              {TestActive ? "Active" : "Inactive"}
                            </h6>
                          </div>
                        )} */}
                      </div>
                    </Row>
                  </div>
                )}

                {/* Fill In The Blank */}
                {selectedOption === "option3" && (
                  <div className="option3">
                    <Row className="mb-3">
                      <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                      >
                        <h5 className="ms-5 my-control">Question</h5>
                      </label>
                      <div className="col-md-10">
                        <Input
                          name="question"
                          rows="2"
                          placeholder="Write your Question"
                          type="textarea"
                          className="form-control"
                          value={question}
                          onChange={e => setquestion(e.target.value)}
                          style={{ width: "794px" }}
                          invalid={
                            AddQuestion.touched.question &&
                            AddQuestion.errors.question
                              ? true
                              : false
                          }
                        />
                        {AddQuestion.touched.question &&
                        AddQuestion.errors.question ? (
                          <FormFeedback type="invalid">
                            {AddQuestion.errors.question}
                          </FormFeedback>
                        ) : null}
                        <br />
                        <label htmlFor="img">
                          <h6>Upload Image</h6>
                        </label>
                        <div className="col-md-10">
                          <Col lg={12}>
                            <Input
                              type="file"
                              className="form-control me-auto"
                              id="img"
                              name="media"
                              style={{ width: "794px" }}
                              accept="image/*"
                              onChange={e => handleFileRead(e)}
                              valid={fileData}
                              invalid={
                                AddQuestion.touched.media &&
                                AddQuestion.errors.media
                                  ? true
                                  : false
                              }
                            />
                          </Col>
                        </div>
                        {AddQuestion.touched.media &&
                        AddQuestion.errors.media ? (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            <span>This is required</span>
                          </div>
                        ) : null}
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                      >
                        <h5 className="ms-5 my-control">Option</h5>
                      </label>
                      <div className="col-md-10">
                        <Col lg={11}>
                          <div className="hstack gap-3">
                            {fop1valid ? (
                              <Input
                                type="file"
                                className="form-control me-auto"
                                id="img"
                                accept="image/*"
                                name="op1"
                                value={op1valid}
                                onChange={e => {
                                  setOp1valid(e.target.value),
                                    optionFileRead(e),
                                    setfOp1valid(true)
                                }}
                              />
                            ) : (
                              <Input
                                className="form-control me-auto"
                                type="text"
                                name="op1"
                                value={op1valid}
                                onChange={e => {
                                  setOp1valid(e.target.value),
                                    set1(e.target.value)
                                }}
                                // onChange={e => setOp1valid(e.target.value)}
                                // onBlur={() => arr.push(op1valid)}
                                placeholder="Option"
                                aria-label=""
                              />
                            )}
                            <i
                              className="far fa-image"
                              onClick={() => setfOp1valid(!fop1valid)}
                            ></i>
                            <input
                              type="radio"
                              name="answer"
                              onClick={handleOptionChange}
                              checked={Answer === op1valid}
                              value={op1valid}
                              onBlur={() => setArrayIndex(0)}
                            />{" "}
                            Correct
                            <br />
                          </div>
                          {/* <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            {!fop1valid ? "This is required" : ""}
                          </div> */}
                        </Col>
                        <br />

                        <Col lg={11}>
                          <div className="hstack gap-3">
                            {fop2valid ? (
                              <Input
                                type="file"
                                className="form-control me-auto"
                                id="img"
                                accept="image/*"
                                name="op2"
                                value={op2valid}
                                onChange={e => {
                                  setOp2valid(e.target.value),
                                    optionFileRead(e),
                                    setfOp2valid(true)
                                }}
                              />
                            ) : (
                              <Input
                                className="form-control me-auto"
                                type="text"
                                name="op2"
                                value={op2valid}
                                onChange={e => {
                                  setOp2valid(e.target.value),
                                    set2(e.target.value)
                                }}
                                // onChange={e => setOp2valid(e.target.value)}
                                // onBlur={() => arr.push(op2valid)}
                                placeholder="Option"
                                aria-label=""
                              />
                            )}
                            <i
                              className="far fa-image"
                              onClick={() => setfOp2valid(!fop2valid)}
                            ></i>
                            <input
                              type="radio"
                              name="answer"
                              onClick={handleOptionChange}
                              checked={Answer === op2valid}
                              value={op2valid}
                              onBlur={() => setArrayIndex(1)}
                            />{" "}
                            Correct
                            <br />
                          </div>
                          {/* <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            {!fop2valid ? "This is required" : ""}
                          </div> */}
                        </Col>
                        <br />

                        <Col lg={11}>
                          <div className="hstack gap-3">
                            {fop3valid ? (
                              <Input
                                type="file"
                                className="form-control me-auto"
                                id="img"
                                accept="image/*"
                                name="op3"
                                value={op3valid}
                                onChange={e => {
                                  setOp3valid(e.target.value),
                                    optionFileRead(e),
                                    setfOp3valid(true)
                                }}
                              />
                            ) : (
                              <Input
                                className="form-control me-auto"
                                type="text"
                                name="op3"
                                value={op3valid}
                                onChange={e => {
                                  setOp3valid(e.target.value),
                                    set3(e.target.value)
                                }}
                                // onChange={e => setOp3valid(e.target.value)}
                                // onBlur={() => arr.push(op3valid)}
                                placeholder="Option"
                                aria-label=""
                              />
                            )}
                            <i
                              className="far fa-image"
                              onClick={() => setfOp3valid(!fop3valid)}
                            ></i>
                            <input
                              type="radio"
                              name="answer"
                              onClick={handleOptionChange}
                              checked={Answer === op3valid}
                              value={op3valid}
                              onBlur={() => setArrayIndex(2)}
                            />{" "}
                            Correct
                            <br />
                          </div>
                          {/* <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            {!fop3valid ? "This is required" : ""}
                          </div> */}
                        </Col>
                        <br />

                        <Col lg={11}>
                          <div className="hstack gap-3">
                            {fop4valid ? (
                              <Input
                                type="file"
                                className="form-control me-auto"
                                id="img"
                                accept="image/*"
                                name="op4"
                                value={op4valid}
                                onChange={e => {
                                  setOp4valid(e.target.value),
                                    optionFileRead(e),
                                    setfOp4valid(true)
                                }}
                              />
                            ) : (
                              <Input
                                className="form-control me-auto"
                                type="text"
                                name="op4"
                                value={op4valid}
                                onChange={e => {
                                  setOp4valid(e.target.value),
                                    set4(e.target.value)
                                }}
                                // onChange={e => setOp4valid(e.target.value)}
                                // onBlur={() => arr.push(op4valid)}
                                placeholder="Option"
                                aria-label=""
                              />
                            )}
                            <i
                              className="far fa-image"
                              onClick={() => setfOp4valid(!fop4valid)}
                            ></i>
                            <input
                              type="radio"
                              name="answer"
                              onClick={handleOptionChange}
                              checked={Answer === op4valid}
                              value={op4valid}
                              onBlur={() => setArrayIndex(3)}
                            />
                            Correct
                            <br />
                          </div>

                          {/* <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            {!fop4valid ? "This is required" : ""}
                          </div> */}
                        </Col>
                        {AddQuestion.touched.answer &&
                        AddQuestion.errors.answer ? (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                              float: "right",
                            }}
                          >
                            Choose Correct Option
                          </div>
                        ) : null}
                        <br />
                        <Button
                          type="submit"
                          className="btn btn-primary me-1  "
                          id="ExampleTrigger"
                        >
                          ADD FILL IN THE BLANK QUESTION
                        </Button>
                        <a
                          onClick={() => handleClear()}
                          className="btn btn-danger mx-1"
                        >
                          Clear
                        </a>

                        {/* {validationType.values.no_of_question >=
                        Number(questionCount + 1) ? (
                          <Button
                            type="submit"
                            className="btn btn-primary me-1  "
                            id="ExampleTrigger"
                          >
                            ADD FILL IN THE BLANK QUESTION
                          </Button>
                        ) : (
                          <div className="square-switch d-flex">
                            <input
                              type="checkbox"
                              id="square-switch1"
                              className="switch"
                              defaultChecked={TestActive}
                              onChange={() => {
                                ActiveInactive(!TestActive)
                                setTestActive(!TestActive)
                              }}
                            />
                            <label
                              htmlFor="square-switch1"
                              data-on-label="*"
                              data-off-label="x"
                            />
                            <h6
                              className={`${
                                TestActive ? "text-success" : "text-danger"
                              } mx-2`}
                            >
                              {TestActive ? "Active" : "Inactive"}
                            </h6>
                          </div>
                        )} */}
                      </div>
                    </Row>
                  </div>
                )}

                {/* True or False Question */}
                {selectedOption === "option2" && (
                  <div className="option2">
                    <Row className="mb-3">
                      <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                      >
                        <h5 className="ms-5 my-control">Question</h5>
                      </label>
                      <div className="col-md-10">
                        <Input
                          name="question"
                          rows="2"
                          placeholder="Write your Question"
                          type="textarea"
                          className="form-control"
                          value={question}
                          onChange={e => setquestion(e.target.value)}
                          style={{ width: "794px" }}
                          invalid={
                            AddQuestion.touched.question &&
                            AddQuestion.errors.question
                              ? true
                              : false
                          }
                        />
                        {AddQuestion.touched.question &&
                        AddQuestion.errors.question ? (
                          <FormFeedback type="invalid">
                            {AddQuestion.errors.question}
                          </FormFeedback>
                        ) : null}
                        <br />
                        <label htmlFor="img">
                          <h6>Upload Image</h6>
                        </label>
                        <div className="col-md-10">
                          <Col lg={12}>
                            <Input
                              type="file"
                              className="form-control me-auto"
                              id="img"
                              name="media"
                              style={{ width: "794px" }}
                              accept="image/*"
                              onChange={e => handleFileRead(e)}
                              valid={fileData}
                              invalid={
                                AddQuestion.touched.media &&
                                AddQuestion.errors.media
                                  ? true
                                  : false
                              }
                            />
                          </Col>
                        </div>
                        {AddQuestion.touched.media &&
                        AddQuestion.errors.media ? (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            <span>This is required</span>
                          </div>
                        ) : null}
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label
                        htmlFor="example-text-input"
                        className="col-md-2 col-form-label"
                      >
                        <h5 className="ms-5 my-control">Option</h5>
                      </label>
                      <div className="col-md-10">
                        <Col lg={11}>
                          <div className="hstack gap-3">
                            <Input
                              disabled
                              className="form-control me-auto"
                              type="text"
                              name="true"
                              placeholder="True"
                              aria-label=""
                              value="True"
                            />
                            <input
                              type="radio"
                              name="answer"
                              // checked={Answer === "True"}
                              value={"True"}
                              onChange={e => {
                                setAnswer(e.target.value),
                                  setarr(["True", "False"])
                              }}
                            />{" "}
                            Correct
                            <br />
                          </div>
                        </Col>
                        <br />

                        <Col lg={11}>
                          <div className="hstack gap-3">
                            <Input
                              disabled
                              className="form-control me-auto"
                              type="text"
                              placeholder="False"
                              name="false"
                              aria-label=""
                              value="False"
                            />
                            <input
                              type="radio"
                              name="answer"
                              // checked={Answer === "False"}
                              value={"False"}
                              onChange={e => {
                                setAnswer(e.target.value),
                                  setarr(["False", "True"])
                              }}
                            />{" "}
                            Correct
                            <br />
                          </div>
                        </Col>
                        {AddQuestion.touched.answer &&
                        AddQuestion.errors.answer ? (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                              float: "right",
                            }}
                          >
                            Choose Correct Option
                          </div>
                        ) : null}
                        <br />
                        <br />
                        <Button
                          type="submit"
                          className="btn btn-primary me-1  "
                          id="ExampleTrigger"
                        >
                          ADD TRUE FALSE QUESTION
                        </Button>
                        <a
                          onClick={() => handleClear()}
                          className="btn btn-danger mx-1"
                        >
                          Clear
                        </a>
                        {/* {validationType.values.no_of_question >=
                        Number(questionCount + 1) ? (
                          <Button
                            type="submit"
                            className="btn btn-primary me-1  "
                            id="ExampleTrigger"
                          >
                            ADD TRUE FALSE QUESTION
                          </Button>
                        ) : (
                          <div className="square-switch d-flex">
                            <input
                              type="checkbox"
                              id="square-switch1"
                              className="switch"
                              defaultChecked={TestActive}
                              onChange={() => {
                                ActiveInactive(!TestActive)
                                setTestActive(!TestActive)
                              }}
                            />
                            <label
                              htmlFor="square-switch1"
                              data-on-label="*"
                              data-off-label="x"
                            />
                            <h6
                              className={`${
                                TestActive ? "text-success" : "text-danger"
                              } mx-2`}
                            >
                              {TestActive ? "Active" : "Inactive"}
                            </h6>
                          </div>
                        )} */}
                      </div>
                    </Row>
                  </div>
                )}
              </div>
            </form>
          </div>
        ) : null}

        {ViewQuestion?.map(
          (
            {
              id,
              question,
              option,
              que_answer,
              fk_test_id,
              option_media,
              media,
            },
            i
          ) => (
            <div className="px-5 py-3 bg-white" key={id}>
              <div className="m-3 row">
                <div className="d-flex">
                  <label
                    htmlFor="example test input"
                    className="col-form-label"
                  >
                    <strong className="m-4">{i + 1}. </strong>
                  </label>

                  <div className="col-md-11">
                    <div className="col-lg-12">
                      <div className="hstack gap-3">
                        <input
                          disabled
                          aria-label=""
                          value={question}
                          type="text"
                          className="form-control-auto form-control bg-white"
                        />
                        <br />
                      </div>
                      {media ? (
                        <img
                          className="p-2"
                          style={{
                            width: "200px",
                            height: "200px",
                            // borderRadius: 5,
                          }}
                          src={`${config.BaseImageUrl}/${media}`}
                        />
                      ) : null}
                    </div>
                  </div>
                  <a
                    onClick={() => deleteQuestion(id, fk_test_id)}
                    className="text-danger"
                  >
                    <i
                      className="mdi mdi-delete font-size-18"
                      id="deletetooltip"
                    ></i>
                  </a>
                </div>
              </div>
              <div className="col-md-11 mx-auto d-flex">
                <label className="col-form-label m-2">
                  {/* <strong className="m-4">Option :</strong> */}
                </label>
                <div className="d-flex">
                  {option.map(({ id, option, option_media }, i) => (
                    <label className="radio-inline mx-4 d-flex" key={id}>
                      <h6 className="mx-1">
                        {i + 1 === 1
                          ? "a) "
                          : i + 1 === 2
                          ? "b) "
                          : i + 1 === 3
                          ? "c) "
                          : i + 1 === 4
                          ? "d) "
                          : ""}
                      </h6>

                      {option_media ? (
                        <img
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: 5,
                          }}
                          src={`${config.BaseImageUrl}/${option_media}`}
                        />
                      ) : (
                        <text className="mx-1">{option}</text>
                      )}
                    </label>
                  ))}
                </div>
              </div>
              <label className="col-form-label mx-5">
                <strong className="mx-4 text-success">Answer : </strong>
                {que_answer[0]?.fk_option__option_media ? (
                  <a
                    href={`/${config.BaseImageUrl}/${que_answer[0]?.fk_option__option_media}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mx-3"
                  >
                    <img
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "green",
                      }}
                      src={`${config.BaseImageUrl}/${que_answer[0]?.fk_option__option_media}`}
                    />
                  </a>
                ) : null}
                {que_answer[0]?.fk_option__option ? (
                  <sapn className="mx-2">
                    <strong>{que_answer[0]?.fk_option__option}</strong>
                  </sapn>
                ) : null}
              </label>
            </div>
          )
        )}
      </div>
    </>
  )
}

export default TestEditPage
