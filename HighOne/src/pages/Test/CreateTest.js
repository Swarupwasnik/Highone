import React, { ChangeEvent, useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import * as Yup from "yup"
import { useFormik } from "formik"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Select from "react-select"
import { classApi } from "apis/ClassListApi"
import AddQuestion from "./AddQuestion"

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
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap"
import { TestApi } from "apis/TestApi"
import { set } from "lodash"

function CreateTest() {
  const [modal_backdrop, setmodal_backdrop] = useState(false)

  //meta title
  document.title = "Create Test"
  const [singlebtn1, setSinglebtn1] = useState(false)
  const [isopen, setisOpen] = useState(false)
  const [isSubmited, setisSubmited] = useState(false)
  const [singlebtn2, setSinglebtn2] = useState(false)
  const [singlebtn3, setSinglebtn3] = useState(false)
  const [calender, setCalendar] = useState("")
  const [classList, setClassList] = useState([])
  const [Time, setTime] = useState("")
  const [modal, setModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [subselected, setSubSelected] = useState([])
  const [selected, setSelected] = useState([])
  const [show, setShow] = useState(false)
  const [date, setDate] = useState(false)
  const [arr, setarr] = useState([])
  const [inputValues, setInputValues] = useState([])
  const [fInputValues, setFInputValues] = useState([])
  const [tfInputValues, setTFInputValues] = useState([])
  const [testHide, seTestHide] = useState(false)
  const [questionHide, setQuestionHide] = useState(true)
  const [questionNumber, setQuestionNumber] = useState()
  const [fileData, setFileData] = useState()
  const [sCOpt1, setSCOpt1] = useState()
  const [questionCount, setQuestionCount] = useState(0)

  const [f_class, setF_class] = useState("")
  const [classSectionListOption, setClassSectionListOption] = useState([])
  let filterClassSectionList = classSectionListOption?.filter(
    (list, index, arr) => {
      return index === arr.findIndex(d => d.label === list.label)
    }
  )
  const [user, setUserLogged] = useState(
    JSON.parse(localStorage.getItem("User"))
  )

  const [localQuestion, setLocalQuestion] = useState(
    JSON.parse(localStorage.getItem("question1"))
  )
  const [localQuestion1, setLocalQuestion1] = useState(
    JSON.parse(localStorage.getItem("question2"))
  )
  const [localQuestion2, setLocalQuestion2] = useState(
    JSON.parse(localStorage.getItem("question5"))
  )
  const [localQuestion3, setLocalQuestion3] = useState(
    JSON.parse(localStorage.getItem("question6"))
  )

  const [localQuestion4, setLocalQuestion4] = useState(
    JSON.parse(localStorage.getItem("question7"))
  )

  const [localQuestion5, setLocalQuestion5] = useState(
    JSON.parse(localStorage.getItem("question8"))
  )

  const [localQuestion6, setLocalQuestion6] = useState(
    JSON.parse(localStorage.getItem("question9"))
  )

  const [localQuestion7, setLocalQuestion7] = useState(
    JSON.parse(localStorage.getItem("question10"))
  )

  const [localQuestion8, setLocalQuestion8] = useState(
    JSON.parse(localStorage.getItem("question11"))
  )

  const [localQuestion9, setLocalQuestion9] = useState(
    JSON.parse(localStorage.getItem("question12"))
  )

  const [localQuestion10, setLocalQuestion10] = useState(
    JSON.parse(localStorage.getItem("question13"))
  )

  const [localQuestion11, setLocalQuestion11] = useState(
    JSON.parse(localStorage.getItem("question14"))
  )

  const [localQuestion12, setLocalQuestion12] = useState(
    JSON.parse(localStorage.getItem("question15"))
  )

  const [localQuestion13, setLocalQuestion13] = useState(
    JSON.parse(localStorage.getItem("question16"))
  )

  const [localQuestion14, setLocalQuestion14] = useState(
    JSON.parse(localStorage.getItem("question17"))
  )

  const [localQuestion15, setLocalQuestion15] = useState(
    JSON.parse(localStorage.getItem("question18"))
  )

  const [localQuestion16, setLocalQuestion16] = useState(
    JSON.parse(localStorage.getItem("question19"))
  )

  const [localQuestion17, setLocalQuestion17] = useState(
    JSON.parse(localStorage.getItem("question20"))
  )

  const [questions, setquestions] = useState({
    question_answer: "Manoj Khase",
    question: questionNumber ? questionNumber : "",
    media: "",
    single_choice: "True",
    fillinblanks: "False",
    true_false: "True",
    option: [1, 2, 3, 4],
    answer: "1",
  })
  const queshandleChange = e => {
    const { name, value } = e.target
    setquestions(prev => ({ ...prev, [name]: value }))
  }

  const myarr = []
  const pushhandler = () => {
    myarr.push(questions)
    console.log(myarr, "ggg")
    setarr(myarr)
    // setQuestionCount(questionCount + 1)
    // console.log(e,'ttt')
    return
    const formData = new FormData(e.target)
    const newEntries = []
    for (const [name, value] of formData) {
      newEntries.push({
        name,
        value,
      })
    }
  }
  const animals = []
  const handleChange = e => {
    console.log("handleChange")
    setInputValues(inputValues => [...inputValues, e.target.value])
    const myarr1 = []
    let animal2 = []
    animal2.push(e.target.value)
    animals.push(...animal2)
    setarr(myarr1)
    setquestions({
      question_answer: "Manoj Khase",
      // question: questionNumber ? questionNumber : "",
      question_data: "",
      media: e.target.value,
      single_choice: "True",
      fillinblanks: "False",
      true_false: "True",
      // option: [1, 2, 3, 4],myarr1
      option: myarr1,
      answer: "1",
    })
    // console.log(e.target.value,'e.target.value')
  }
  // console.log(inputValues,fInputValues,tfInputValues, "inputValues fInputValues tfInputValues")
  // console.log(animals,'newArray')
  const [duration, setDuration] = useState([])
  const [noOfQuestion, setNoOfQuestion] = useState([])
  useEffect(() => {
    TestApi.getNoOfQuestion()
      .then(res => {
        setNoOfQuestion(
          res.data?.noofquestion?.map(que => {
            return {
              value: que.id,
              label: que.noof_question,
            }
          })
        )
      })
      .catch(err => console.log(err.message))
  }, [])
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

  const handleOptionChange = event => {
    setSelectedOption(event.target.value)
  }
  const handleDateChange = event => {
    setDate(event.target.value)
  }
  // let fileDataRecord = ""
  const handleFileRead = async event => {
    const file = event.target.files[0]
    const base64 = await convertBase64(file)
    setFileData(base64.split("base64,")[1])
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

  const subjectListOption = classList?.subject?.map(sub => {
    return {
      value: sub.subject_code,
      label: sub.subject_name,
    }
  })
  //   let classListOption =classList?.filter((list,index,arr)=>{
  //     return index === arr.findIndex((d)=> d.label=== list.label)
  // });
  // if(user === "Admin"){
  // const classListOption = classList?.section_list?.map(cl => {
  //     return {
  //       value: cl.UID,
  //       label: `${cl.st_class}`,
  //     }
  //   })
  // }
  const classListOption = user?.teacher_subject?.map(cl => {
    return {
      value: cl.UID,
      label: `${cl.st_class}`,
    }
  })
  // const test = JSON.parse(localQuestion)
  const formClear = () => {
    validationType.resetForm()
  }
  const validationType = useFormik({
    enableReinitialize: true,
    initialValues: {
      op1: "",
      op2: "",
      op3: "",
      op4: "",
      fop1: "",
      fop2: "",
      fop3: "",
      fop4: "",
      time_data: "",
      ttrue: true,
      tfalse: false,
      test_name: "",
      // test_name: user?.payload?.t_name,
      st_class: selected,
      subject: subselected,
      duration: "",
      no_of_question: "",
      start_date: "",
      question_number: "",
      answer: "",
      // media:fileData ? fileData : "",
      // originalFileName:fileData,
      question: [
        localQuestion,
        localQuestion1,
        // localQuestion2,localQuestion3,
        // localQuestion4,localQuestion5,
        // localQuestion6,localQuestion7,
        // localQuestion8,localQuestion9,
        // localQuestion10,localQuestion11,
        // localQuestion12,localQuestion13
      ],
      teacher_code: user?.payload?.t_code ? user?.payload?.t_code : "",
      added_by: user == "Admin" ? "Admin" : "Teacher",
    },
    validationSchema: Yup.object().shape({
      time_data: Yup.string().required("This is required"),
      test_name: Yup.string().required("This is required"),
      st_class: Yup.string().required("This is required"),
      subject: Yup.string().required("This is required"),
      duration: Yup.string().required("This is required"),
      no_of_question: Yup.string().required("This is required"),
      start_date: Yup.string().required("This is required"),
      teacher_code: Yup.string().required("This is required"),
      added_by: Yup.string().required("This is required"),
    }),
    onSubmit: async values => {
      setQuestionCount(questionCount + 1)
      values.media = await fileData
      values.start_date = values.start_date + "T" + values.time_data
      values.start_date_only = values.start_date
      console.log(values, "values")
      // return
      if (
        values.op1 != "" &&
        values.op2 != "" &&
        values.op3 != "" &&
        values.op4 != ""
      ) {
        if (inputValues.length <= 0) {
          setInputValues(inputValues => [...inputValues, values.op1])
          setInputValues(inputValues => [...inputValues, values.op2])
          setInputValues(inputValues => [...inputValues, values.op3])
          setInputValues(inputValues => [...inputValues, values.op4])
        }
      }

      if (
        values.fop1 != "" &&
        values.fop2 != "" &&
        values.fop3 != "" &&
        values.fop4 != ""
      ) {
        if (fInputValues.length <= 0) {
          setFInputValues(fInputValues => [...fInputValues, values.fop1])
          setFInputValues(fInputValues => [...fInputValues, values.fop2])
          setFInputValues(fInputValues => [...fInputValues, values.fop3])
          setFInputValues(fInputValues => [...fInputValues, values.fop4])
        }
      }
      if (tfInputValues.length <= 0) {
        setTFInputValues(tfInputValues => [...tfInputValues, values.ttrue])
        setTFInputValues(tfInputValues => [...tfInputValues, values.tfalse])
      }
      if (inputValues.length !== 0) {
        setquestions({
          question_answer: values.answer,
          question: values.question_data,
          media: values.media,
          single_choice: "True",
          fillinblanks: "False",
          true_false: "True",
          option: inputValues,
          answer: values.answer,
        })
        localStorage.setItem(
          "question" + questionCount,
          JSON.stringify(questions)
        )
      }

      if (fInputValues.length !== 0) {
        setquestions({
          question_answer: values.answer,
          question: values.question_data,
          media: values.media,
          single_choice: "True",
          fillinblanks: "False",
          true_false: "True",
          option: fInputValues,
          answer: values.answer,
        })
        localStorage.setItem(
          "question" + questionCount,
          JSON.stringify(questions)
        )
      }

      seTestHide(true)

      localStorage.setItem("profileQuestion", JSON.stringify(values))
      window.location.href = "/add-question"
      TestApi.createTestQuiz(values)
    },
  })
  const handleSubmit = e => {
    const formData = new FormData(e.target)

    const newEntries = []
    for (const [name, value] of formData) {
      newEntries.push({
        name,
        value,
      })
    }

    setarr(newEntries)
    e.preventDefault()
    setisSubmited(true)
  }
  function tog_backdrop() {
    setmodal_backdrop(!modal_backdrop)
    // removeBodyCss();
  }
  // console.log(arr,'setarr')
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
                          Test/Quiz
                        </h1>
                        {/* <div className="flex-shrink-0">
                          <Link to="/test" className="btn btn-primary me-1">
                            Previous Test Result
                          </Link>
                        </div> */}
                      </div>
                    </CardBody>

                    <CardBody>
                      {/* <Form className="needs-validation"> */}
                      {!testHide ? (
                        <Row className="mb-3 px-4">
                          <Col sm={9}>
                            <div className="hstack gap-0">
                              <label
                                htmlFor="example test input"
                                className="col-md-2 col-form-label"
                              >
                                <strong className="fs-6">Test Name </strong>
                              </label>
                              <div className="col-md-10">
                                <Input
                                  name="test_name"
                                  placeholder="Enter Test Name"
                                  type="text"
                                  className="form-control-auto"
                                  onChange={validationType.handleChange}
                                  onBlur={validationType.handleBlur}
                                  // value={validationType.values.test_name || ""}
                                  invalid={
                                    validationType.touched.test_name &&
                                    validationType.errors.test_name
                                      ? true
                                      : false
                                  }
                                />
                                {validationType.touched.test_name &&
                                validationType.errors.test_name ? (
                                  <FormFeedback type="invalid">
                                    {validationType.errors.test_name}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      ) : (
                        ""
                      )}
                      {!testHide ? (
                        <CardBody>
                          <Row className="mb-3">
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">Subjects</Label>
                                <select
                                  name="subject"
                                  type="select"
                                  className="form-select"
                                  onChange={validationType.handleChange}
                                  onBlur={validationType.handleBlur}
                                  value={validationType.values.subject || ""}
                                >
                                  <option value="">Select Subject</option>
                                  {/* subjectListOption */}
                                  {subject_list?.map((item, index) => (
                                    <option value={item.label} key={index}>
                                      {item?.label}
                                    </option>
                                  ))}
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
                                    {/* {validationType.errors.subject} */}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">Class</Label>
                                <select
                                  name="st_class"
                                  type="select"
                                  className="form-select"
                                  onChange={validationType.handleChange}
                                  onBlur={validationType.handleBlur}
                                  value={validationType.values.st_class || ""}
                                >
                                  <option value="">Select Class</option>
                                  {/* {classListOption?.map((item, index) => (
                                    <option value={item.label} key={index}>
                                      {item?.label}
                                    </option>
                                  ))} */}
                                  {filterClassSectionList?.map(class1 => (
                                    <option
                                      key={class1.value}
                                      value={class1.label}
                                    >
                                      {class1.label.toUpperCase()}
                                    </option>
                                  ))}
                                </select>

                                {/* <select
                              className="form-select"
                              type="select"
                              name="class"
                              onChange={e => setF_class(e.target.value)}
                            >
                              <option value="">Select Class</option>
                              {filterClassSectionList?.map(class1 => (
                                <option key={class1.value} value={class1.label}>
                                  {class1.label.toUpperCase()}
                                </option>
                              ))}
                            </select> */}
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
                                    {/* {validationType.errors.st_class} */}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">Question</Label>
                                <select
                                  name="no_of_question"
                                  type="select"
                                  className="form-select"
                                  onChange={validationType.handleChange}
                                  onBlur={validationType.handleBlur}
                                  value={
                                    validationType.values.no_of_question || ""
                                  }
                                >
                                  <option value="">
                                    Select No Of Question
                                  </option>
                                  {noOfQuestion?.map((item, index) => (
                                    <option value={item.label} key={index}>
                                      {item?.label}
                                    </option>
                                  ))}
                                </select>
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
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">
                                  Duration (Minutes)
                                </Label>
                                <select
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
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">
                                  Date and Time
                                </Label>
                                <Input
                                  className="form-control-auto"
                                  type="date"
                                  name="start_date"
                                  value={validationType.values.start_date || ""}
                                  onChange={validationType.handleChange}
                                  onBlur={validationType.handleBlur}
                                  placeholder="Select Date"
                                />
                                {validationType.touched.start_date &&
                                validationType.errors.start_date ? (
                                  <div
                                    style={{
                                      color: "#f46a6a",
                                      fontSize: "11px",
                                      marginTop: "3px",
                                    }}
                                  >
                                    {validationType.errors.start_date}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">Time</Label>
                                <Input
                                  className="form-control"
                                  type="time"
                                  name="time_data"
                                  value={validationType.values.time_data || ""}
                                  onChange={validationType.handleChange}
                                  onBlur={validationType.handleBlur}
                                />
                                {validationType.touched.time_data &&
                                validationType.errors.time_data ? (
                                  <div
                                    style={{
                                      color: "#f46a6a",
                                      fontSize: "11px",
                                      marginTop: "3px",
                                    }}
                                  >
                                    {validationType.errors.time_data}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label
                                  className="form-label"
                                  style={{ color: "white" }}
                                >
                                  Date and Time
                                </Label>
                                {/* <Input
                                className="form-control-auto"
                                type="datetime-local"
                                name="start_date"
                                value={validationType.values.start_date || ""}
                                onChange={validationType.handleChange}
                                onBlur={validationType.handleBlur}
                                placeholder="Select Date"
                              /> */}
                                {!testHide ? (
                                  <div className="d-flex flex-wrap gap-2">
                                    <Button
                                      type="submit"
                                      color="primary"
                                      className="btn "
                                    >
                                      Add Question
                                    </Button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </Col>
                            {/* <Row className="mb-3">
                            <Label
                              htmlFor="example-datetime-local-input"
                              className="col-md-2 col-form-label"
                            >
                              Date and time
                            </Label>
                            <div className="col-md-10">
                              <input
                                className="form-control"
                                type="datetime-local"
                                defaultValue="2019-08-19T13:45:00"
                                id="example-datetime-local-input"
                              />
                            </div>
                          </Row> */}
                          </Row>
                        </CardBody>
                      ) : (
                        ""
                      )}
                      {testHide ? (
                        <div className="border border-black bg-body">
                          <div className="container">
                            <div className="form-inline py-2">
                              <label
                                htmlFor="example test input"
                                className="col-md-2 col-form-label"
                              >
                                <strong className="grow-1 me-2 row-md-8">
                                  Question Types
                                </strong>
                              </label>
                              <input
                                type="radio"
                                value="option1"
                                checked={selectedOption === "option1"}
                                className="mx-md-3"
                                onChange={handleOptionChange}
                                id="contactChoice1"
                                name="contact"
                              />
                              <label
                                className="col px-md-3"
                                htmlFor="contactChoice1"
                              >
                                <p className="fs-6">Single Choice</p>
                              </label>

                              <input
                                value="option2"
                                checked={selectedOption === "option2"}
                                type="radio"
                                id="contactChoice1"
                                className="mx-md-3"
                                onChange={handleOptionChange}
                                name="contact"
                              />
                              <label
                                className="col px-md-3"
                                htmlFor="contactChoice1"
                              >
                                <p className="fs-6">True or False</p>
                              </label>

                              <input
                                type="radio"
                                value="option3"
                                checked={selectedOption === "option3"}
                                id="contactChoice1"
                                className="mx-md-3"
                                onChange={handleOptionChange}
                                name="contact"
                              />
                              <label
                                className="col px-md-3"
                                htmlFor="contactChoice1"
                              >
                                <p className="fs-6">Fill In The Blanks</p>
                              </label>

                              <label
                                className="float-end col mt-3"
                                htmlFor="contactChoice1"
                              >
                                <p className="fs-6">2/20</p>
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
                                  <h5 className="ms-5">Question</h5>
                                </label>
                                <div className="col-md-10">
                                  <Input
                                    name="question_data"
                                    rows="2"
                                    placeholder="Which City is the Capital Of India....."
                                    type="textarea"
                                    className="form-control"
                                    value={
                                      validationType?.values?.question_data ||
                                      ""
                                    }
                                    onChange={validationType.handleChange}
                                    // value={questions.question}
                                    // value={questions.question}
                                    // onChange={queshandleChange}
                                  />
                                  <br />
                                  <label htmlFor="img">
                                    <h6>Upload Image</h6>
                                  </label>
                                  <div className="col-md-9">
                                    <Col lg={12}>
                                      <Input
                                        type="file"
                                        className="form-control me-auto"
                                        id="img"
                                        name="originalFileName"
                                        // value={
                                        //   validationType?.values?.originalFileName || ""
                                        // }
                                        // onChange={validationType.handleChange}
                                        accept="image/*, .xlsx, .xls, .csv, .pdf, .pptx, .pptm, .ppt"
                                        onChange={e => handleFileRead(e)}
                                        // onChange={(event) => {
                                        //   setFileData("file", event.currentTarget.files[0]);
                                        // }}
                                      />
                                    </Col>
                                  </div>
                                </div>
                              </Row>

                              <Row className="mb-3">
                                <label
                                  htmlFor="example-text-input"
                                  className="col-md-2 col-form-label"
                                >
                                  <h5 className="ms-5">Option</h5>
                                </label>
                                <div className="col-md-10">
                                  <Col lg={11}>
                                    <div className="hstack gap-3">
                                      <Input
                                        className="form-control me-auto"
                                        type="text"
                                        name="op1"
                                        value={
                                          validationType?.values?.op1 || ""
                                        }
                                        onChange={validationType.handleChange}
                                        // onChange={() => { validationType.handleChange; setSCOpt1(validationType?.values?.op1) }}
                                        // onDoubleClick={handleChange},setSCOpt1(validationType?.values?.op1)
                                        placeholder="HYDERABAD"
                                        aria-label="Add your item here..."
                                      />
                                      <i className="far fa-image"></i>
                                      <input
                                        type="radio"
                                        name="answer"
                                        value={
                                          validationType?.values?.op1 || ""
                                        }
                                        // value={
                                        //   validationType?.values?.answer || ""
                                        // }
                                        onChange={validationType.handleChange}
                                      />{" "}
                                      Correct
                                      <i className="far fa-times-circle"></i>
                                      <br />
                                    </div>
                                  </Col>
                                  <br />

                                  <Col lg={11}>
                                    <div className="hstack gap-3">
                                      <Input
                                        className="form-control me-auto"
                                        type="text"
                                        name="op2"
                                        // onDoubleClick={handleChange}
                                        value={
                                          validationType?.values?.op2 || ""
                                        }
                                        onChange={validationType.handleChange}
                                        placeholder="MUMBAI"
                                        aria-label="Add your item here..."
                                      />
                                      <i className="far fa-image"></i>
                                      <input
                                        type="radio"
                                        name="answer"
                                        value={
                                          validationType?.values?.op2 || ""
                                        }
                                        onChange={validationType.handleChange}
                                      />{" "}
                                      Correct
                                      <i className="far fa-times-circle"></i>
                                      <br />
                                    </div>
                                  </Col>
                                  <br />

                                  <Col lg={11}>
                                    <div className="hstack gap-3">
                                      <Input
                                        className="form-control me-auto"
                                        type="text"
                                        name="op3"
                                        // onDoubleClick={handleChange}
                                        value={
                                          validationType?.values?.op3 || ""
                                        }
                                        onChange={validationType.handleChange}
                                        placeholder="DELHI"
                                        aria-label="Add your item here..."
                                      />
                                      <i className="far fa-image"></i>
                                      <input
                                        type="radio"
                                        name="answer"
                                        value={
                                          validationType?.values?.op3 || ""
                                        }
                                        onChange={validationType.handleChange}
                                      />{" "}
                                      Correct
                                      <i className="far fa-times-circle"></i>
                                      <br />
                                    </div>
                                  </Col>
                                  <br />

                                  <Col lg={11}>
                                    <div className="hstack gap-3">
                                      <Input
                                        className="form-control me-auto"
                                        type="text"
                                        name="op4"
                                        // onDoubleClick={handleChange}
                                        value={
                                          validationType?.values?.op4 || ""
                                        }
                                        onChange={validationType.handleChange}
                                        placeholder="KOLKATA"
                                        aria-label="Add your item here..."
                                      />
                                      <i className="far fa-image"></i>
                                      <input
                                        type="radio"
                                        name="answer"
                                        value={
                                          validationType?.values?.op4 || ""
                                        }
                                        onChange={validationType.handleChange}
                                      />
                                      Correct
                                      <i className="far fa-times-circle"></i>
                                      <br />
                                    </div>
                                  </Col>
                                  <br />
                                  <Button
                                    type="submit"
                                    // onClick={e => pushhandler()}
                                    className="btn btn-primary me-1  "
                                  >
                                    ADD
                                  </Button>
                                  {/* <Link to="#!" onClick={() => setModal(true)} className="btn btn-primary me-1 col-md-2 m-2"> ADD <i className="far fa-arrow-alt-circle-right"></i>  </Link> */}
                                </div>
                              </Row>
                            </div>
                          )}

                          {/* //Fill IN THe BLank */}
                          {selectedOption === "option3" && (
                            <div className="option3">
                              <Row className="mb-3">
                                <label
                                  htmlFor="example-text-input"
                                  className="col-md-2 col-form-label"
                                >
                                  <h5 className="ms-5">Question</h5>
                                </label>
                                <div className="col-md-10">
                                  <textarea
                                    className="form-control"
                                    type="text"
                                    defaultValue="_____________ is The Capital Of India."
                                  />
                                  <label htmlFor="img">
                                    <h6>Upload Image</h6>
                                  </label>
                                  <input
                                    type="file"
                                    id="img"
                                    name="img"
                                    accept="image/*"
                                  />
                                </div>
                              </Row>

                              <Row className="mb-3">
                                <label
                                  htmlFor="example-text-input"
                                  className="col-md-2 col-form-label"
                                >
                                  <h5 className="ms-5">Option</h5>
                                </label>
                                <div className="col-md-10">
                                  <Col lg={11}>
                                    <div className="hstack gap-3">
                                      <Input
                                        // onChange={handleChange}
                                        className="form-control me-auto"
                                        type="text"
                                        name="fop1"
                                        // onDoubleClick={handleChange}
                                        value={
                                          validationType?.values?.fop1 || ""
                                        }
                                        onChange={validationType.handleChange}
                                        placeholder="HYDERABAD"
                                        aria-label="Add your item here..."
                                      />
                                      <i className="far fa-image"></i>
                                      <input
                                        type="checkbox"
                                        name="cb-cars"
                                        value="likes"
                                      />{" "}
                                      Correct
                                      <i className="far fa-times-circle"></i>
                                      <br />
                                    </div>
                                  </Col>
                                  <br />

                                  <Col lg={11}>
                                    <div className="hstack gap-3">
                                      <Input
                                        className="form-control me-auto"
                                        type="text"
                                        name="fop2"
                                        // onDoubleClick={handleChange}
                                        value={
                                          validationType?.values?.fop2 || ""
                                        }
                                        onChange={validationType.handleChange}
                                        placeholder="MUMBAI"
                                        aria-label="Add your item here..."
                                      />
                                      <i className="far fa-image"></i>
                                      <input
                                        type="checkbox"
                                        name="cb-cars"
                                        value="likes"
                                      />{" "}
                                      Correct
                                      <i className="far fa-times-circle"></i>
                                      <br />
                                    </div>
                                  </Col>
                                  <br />

                                  <Col lg={11}>
                                    <div className="hstack gap-3">
                                      <Input
                                        className="form-control me-auto"
                                        type="text"
                                        name="fop3"
                                        // onDoubleClick={handleChange}
                                        value={
                                          validationType?.values?.fop3 || ""
                                        }
                                        onChange={validationType.handleChange}
                                        placeholder="DELHI"
                                        aria-label="Add your item here..."
                                      />{" "}
                                      <i className="far fa-image"></i>
                                      <input
                                        type="checkbox"
                                        name="cb-cars"
                                        value="likes"
                                      />{" "}
                                      Correct
                                      <i className="far fa-times-circle"></i>
                                      <br />
                                    </div>
                                  </Col>
                                  <br />

                                  <Col lg={11}>
                                    <div className="hstack gap-3">
                                      <Input
                                        className="form-control me-auto"
                                        type="text"
                                        name="fop4"
                                        // onDoubleClick={handleChange}
                                        value={
                                          validationType?.values?.fop4 || ""
                                        }
                                        onChange={validationType.handleChange}
                                        placeholder="KOLKATA"
                                        aria-label="Add your item here..."
                                      />
                                      <i className="far fa-image"></i>
                                      <input
                                        type="checkbox"
                                        name="cb-cars"
                                        value="likes"
                                      />
                                      Correct
                                      <i className="far fa-times-circle"></i>
                                      <br />
                                    </div>
                                  </Col>
                                  <br />
                                  <Button
                                    type="submit"
                                    onClick={e => pushhandler()}
                                    className="btn btn-primary me-1  "
                                  >
                                    ADD
                                  </Button>
                                  {/* <Link
                                  to="#!"
                                  onClick={() => pushhandler()}
                                  // onClick={() => setModal(true)}
                                  className="btn btn-primary "
                                >
                                  {" "}
                                  ADD{" "}
                                </Link> */}
                                </div>
                              </Row>
                            </div>
                          )}

                          {/* True or False
                           */}
                          {selectedOption === "option2" && (
                            <div className="option2">
                              <Row className="mb-3">
                                <label
                                  htmlFor="example-text-input"
                                  className="col-md-2 col-form-label"
                                >
                                  <h5 className="ms-5">Question</h5>
                                </label>
                                <div className="col-md-10">
                                  <textarea
                                    className="form-control"
                                    type="text"
                                    defaultValue="Is Delhi Capital Of India ?"
                                  />
                                  <label htmlFor="img">
                                    <h6>Upload Image</h6>
                                  </label>
                                  <input
                                    type="file"
                                    id="img"
                                    name="img"
                                    accept="image/*"
                                  />
                                </div>
                              </Row>

                              <Row className="mb-3">
                                <label
                                  htmlFor="example-text-input"
                                  className="col-md-2 col-form-label"
                                >
                                  <h5 className="ms-5">Option</h5>
                                </label>
                                <div className="col-md-10">
                                  <Col lg={11}>
                                    <div className="hstack gap-3">
                                      <Input
                                        className="form-control me-auto"
                                        type="text"
                                        name="ttrue"
                                        value={
                                          validationType?.values?.ttrue || ""
                                        }
                                        placeholder="True"
                                        aria-label="Add your item here..."
                                      />
                                      <input
                                        type="checkbox"
                                        name="cb-cars"
                                        value="likes"
                                      />{" "}
                                      Correct
                                      <i className="far fa-times-circle"></i>
                                      <br />
                                    </div>
                                  </Col>
                                  <br />

                                  <Col lg={11}>
                                    <div className="hstack gap-3">
                                      <Input
                                        className="form-control me-auto"
                                        type="text"
                                        placeholder="False"
                                        name="tfalse"
                                        value={
                                          validationType?.values?.tfalse || ""
                                        }
                                        aria-label="Add your item here..."
                                      />
                                      <input
                                        type="checkbox"
                                        name="cb-cars"
                                        value="likes"
                                      />{" "}
                                      Correct
                                      <i className="far fa-times-circle"></i>
                                      <br />
                                    </div>
                                  </Col>
                                  <br />

                                  <br />
                                  <Link
                                    to="#!"
                                    onClick={() => setModal(true)}
                                    className="btn btn-primary "
                                  >
                                    {" "}
                                    ADD{" "}
                                  </Link>
                                </div>
                              </Row>
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </CardBody>
                    {!questionHide ? (
                      <Row className="mb-3">
                        <label
                          htmlFor="example test input"
                          className="col-md-1 col-form-label"
                        >
                          <strong className="m-5">1</strong>
                        </label>
                        <div className="col-md-9">
                          <Col lg={12}>
                            <div className="hstack gap-3">
                              <Input
                                className="form-control-auto"
                                type="text"
                                aria-label="Add your item here..."
                                placeholder="____________ is the Capital of India."
                              />

                              <i className="far fa-edit m-2"></i>
                              <i className="far fa-trash-alt "></i>
                              <br />
                            </div>
                          </Col>
                        </div>
                      </Row>
                    ) : (
                      ""
                    )}
                    {!questionHide ? (
                      <div className="container">
                        <div className="col-sm-11 mx-auto">
                          <label className="radio-inline ms-4">
                            <input
                              type="radio"
                              name="season"
                              id="seasonSummer"
                              value="summer"
                              checked
                            />{" "}
                            Delhi{" "}
                          </label>

                          <label className="radio-inline ms-5">
                            <input
                              type="radio"
                              name="season"
                              id="seasonSummer"
                              value="summer"
                              checked
                            />{" "}
                            Mumbai{" "}
                          </label>
                          <label className="radio-inline ms-5">
                            <input
                              type="radio"
                              name="season"
                              id="seasonWinter"
                              value="winter"
                            />{" "}
                            Kolkata{" "}
                          </label>
                          <label className="radio-inline ms-5">
                            <input
                              type="radio"
                              name="season"
                              id="seasonSpringFall"
                              value="spring-fall"
                            />
                            Hyderabad
                          </label>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {!questionHide ? (
                      <Row className="mb-3">
                        <label
                          htmlFor="example test input"
                          className="col-md-1 col-form-label"
                        >
                          <strong className="m-5">2</strong>
                        </label>
                        <div className="col-md-9">
                          <Col lg={12}>
                            <div className="hstack gap-3">
                              <Input
                                className="form-control-auto"
                                type="text"
                                aria-label="Add your item here..."
                                placeholder="Which City is the Capital of India."
                              />

                              <i className="far fa-edit m-2"></i>
                              <i className="far fa-trash-alt "></i>
                              <br />
                            </div>
                          </Col>
                        </div>
                      </Row>
                    ) : (
                      ""
                    )}
                    {!questionHide ? (
                      <div className="container">
                        <div className="col-sm-11 mx-auto">
                          <label className="radio-inline ms-4">
                            <input
                              type="radio"
                              name="season"
                              id="seasonSummer"
                              value="summer"
                              checked
                            />{" "}
                            Delhi{" "}
                          </label>

                          <label className="radio-inline ms-5">
                            <input
                              type="radio"
                              name="season"
                              id="seasonSummer"
                              value="summer"
                              checked
                            />{" "}
                            Mumbai{" "}
                          </label>
                          <label className="radio-inline ms-5">
                            <input
                              type="radio"
                              name="season"
                              id="seasonWinter"
                              value="winter"
                            />{" "}
                            Kolkata{" "}
                          </label>
                          <label className="radio-inline ms-5">
                            <input
                              type="radio"
                              name="season"
                              id="seasonSpringFall"
                              value="spring-fall"
                            />
                            Hyderabad
                          </label>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {!questionHide ? (
                      <Row className="mb-3">
                        <label
                          htmlFor="example test input"
                          className="col-md-1 col-form-label"
                        >
                          <strong className="m-5">3</strong>
                        </label>
                        <div className="col-md-9">
                          <Col lg={12}>
                            <div className="hstack gap-3">
                              <Input
                                className="form-control-auto"
                                type="text"
                                aria-label="Add your item here..."
                                placeholder="Delhi is the Capital of India."
                              />

                              <i className="far fa-edit m-2"></i>
                              <i className="far fa-trash-alt "></i>
                              <br />
                            </div>
                          </Col>
                        </div>
                      </Row>
                    ) : (
                      ""
                    )}
                    {!questionHide ? (
                      <div className="container">
                        <div className="col-sm-11 mx-auto">
                          <label className="radio-inline ms-4">
                            <input
                              type="radio"
                              name="season"
                              id="seasonSummer"
                              value="summer"
                              checked
                            />{" "}
                            True{" "}
                          </label>

                          <label className="radio-inline ms-5">
                            <input
                              type="radio"
                              name="season"
                              id="seasonSummer"
                              value="summer"
                              checked
                            />
                            False
                          </label>
                          {/* <label className="radio-inline ms-5"><input type="radio" name="season" id="seasonWinter" value="winter"/> Kolkata </label>
            <label className="radio-inline ms-5"><input type="radio" name="season" id="seasonSpringFall" value="spring-fall" disabled/>Hyderabad</label> */}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="container top-100">
                      <div className="row">
                        <div className="col text-center">
                          <div className="popup-container">
                            <div>
                              {/* <button
                                type="submit"
                                className="btn btn-primary "
                              
                              >
                                Generate Test
                              </button> */}
                              <Modal
                                isOpen={modal_backdrop}
                                toggle={() => {
                                  tog_backdrop()
                                }}
                                backdrop={"static"}
                                id="staticBackdrop"
                              >
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id="staticBackdropLabel"
                                  >
                                    Schedule Test
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                      setmodal_backdrop(false)
                                    }}
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <p>
                                    Please select the Test Date and Time before
                                    click on the Submit button
                                  </p>

                                  <Row className="row justify-content-start">
                                    <Col lg={12}>
                                      <section className="row row-cols-lg-auto g-1 align-items-center">
                                        <Col xs={12}>
                                          <div className="form-check">
                                            <label
                                              className="form-check-label grow-1"
                                              htmlFor="inlineFormCheck"
                                            >
                                              <i className="fas fa-calendar-alt fs-4 text-primary"></i>
                                            </label>
                                          </div>
                                        </Col>

                                        <div className="col-md-5">
                                          <Col lg={8}>
                                            <div className="hstack gap-5">
                                              <Input
                                                className="form-control-auto"
                                                type="date"
                                                onChange={handleDateChange}
                                                aria-label="Add your item here..."
                                                placeholder="Select Date"
                                              />
                                            </div>
                                          </Col>
                                        </div>

                                        <Col xs={12}>
                                          <div className="form-check">
                                            <Label
                                              className="form-check-label grow-1"
                                              htmlFor="inlineFormCheck"
                                            >
                                              <i className="fas fa-stopwatch fs-4 text-primary"></i>
                                            </Label>
                                          </div>
                                        </Col>

                                        <div className="col-md-5">
                                          <Col lg={12}>
                                            <div className="hstack gap-5">
                                              <Input
                                                className="form-control-auto"
                                                type="time"
                                                aria-label="Add your item here..."
                                                placeholder="Select Time"
                                              />
                                            </div>
                                          </Col>
                                        </div>
                                      </section>
                                    </Col>
                                  </Row>
                                </div>
                                <div className="modal-footer">
                                  <Link to="#"></Link>
                                  <button
                                    // type="submit"
                                    className="btn btn-primary"
                                    onClick={() => {
                                      setmodal_backdrop(false)
                                    }}
                                  >
                                    Submit
                                  </button>

                                  {/* <button type="button" className="btn btn-primary">Understood</button> */}
                                </div>
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

export default CreateTest
