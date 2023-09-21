import React, { ChangeEvent, useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import * as Yup from "yup"
import { useFormik } from "formik"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Select from "react-select"
import { classApi } from "apis/ClassListApi"
import Swal from "sweetalert2"
import moment from "moment"

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
const AddQuestion = () => {
  // function AddQuestion() {
  const [modal_backdrop, setmodal_backdrop] = useState(false)

  //meta title
  document.title = "Add Question"
  const sessionId = window.sessionStorage.getItem("SessionId")
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
  const [op1valid, setOp1valid] = useState()
  const [op2valid, setOp2valid] = useState()
  const [op3valid, setOp3valid] = useState()
  const [op4valid, setOp4valid] = useState()
  const [fop1valid, setfOp1valid] = useState()
  const [fop2valid, setfOp2valid] = useState()
  const [fop3valid, setfOp3valid] = useState()
  const [fop4valid, setfOp4valid] = useState()
  const [optqAnswer, setOptQAnswer] = useState()
  const [singleChoiceQuestion, setSingleChoiceQuestion] = useState()
  const [fillInTheBlankQuestion, setFillInTheBlankQuestion] = useState()
  const [trueFalseQuestion, setTrueFalseQuestion] = useState()
  const [viewQuestion, setViewQuestion] = useState([])
  const [questionCount, setQuestionCount] = useState(0)
  const [singleChoice, setSingleChoice] = useState(false)
  const [trueFalseValid, setTrueFalseValid] = useState(false)
  const [fileIBValid, setfileIBValid] = useState(false)
  const [user, setUserLogged] = useState(
    JSON.parse(localStorage.getItem("User"))
  )
  const [profileQuestion, setProfileQuestion] = useState(
    JSON.parse(localStorage.getItem("profileQuestion"))
  )

  $("#ExampleTrigger").click(function () {
    $("input[name=answer]").prop("checked", false)
  })

  $("#ExampleTrigger1").click(function () {
    $("input[name=answer]").prop("checked", false)
  })

  $("#ExampleTrigger2").click(function () {
    $("input[name=answer]").prop("checked", false)
  })

  const [localQuestion, setLocalQuestion0] = useState(
    JSON.parse(localStorage.getItem("question0"))
  )
  const [localQuestion1, setLocalQuestion] = useState(
    JSON.parse(localStorage.getItem("question1"))
  )
  const [localQuestion2, setLocalQuestion1] = useState(
    JSON.parse(localStorage.getItem("question2"))
  )
  const [localQuestion3, setLocalQuestion2] = useState(
    JSON.parse(localStorage.getItem("question3"))
  )
  const [localQuestion4, setLocalQuestion3] = useState(
    JSON.parse(localStorage.getItem("question4"))
  )

  const [localQuestion5, setLocalQuestion5] = useState(
    JSON.parse(localStorage.getItem("question5"))
  )

  const [localQuestion6, setLocalQuestion6] = useState(
    JSON.parse(localStorage.getItem("question6"))
  )

  const [localQuestion7, setLocalQuestion7] = useState(
    JSON.parse(localStorage.getItem("question7"))
  )

  const [localQuestion8, setLocalQuestion8] = useState(
    JSON.parse(localStorage.getItem("question8"))
  )

  const [localQuestion9, setLocalQuestion9] = useState(
    JSON.parse(localStorage.getItem("question9"))
  )

  const [localQuestion10, setLocalQuestion10] = useState(
    JSON.parse(localStorage.getItem("question10"))
  )

  const [localQuestion11, setLocalQuestion11] = useState(
    JSON.parse(localStorage.getItem("question11"))
  )

  const [localQuestion12, setLocalQuestion12] = useState(
    JSON.parse(localStorage.getItem("question12"))
  )

  const [localQuestion13, setLocalQuestion13] = useState(
    JSON.parse(localStorage.getItem("question13"))
  )

  const [localQuestion14, setLocalQuestion14] = useState(
    JSON.parse(localStorage.getItem("question14"))
  )

  const [localQuestion15, setLocalQuestion15] = useState(
    JSON.parse(localStorage.getItem("question15"))
  )

  const [localQuestion16, setLocalQuestion16] = useState(
    JSON.parse(localStorage.getItem("question16"))
  )

  const [localQuestion17, setLocalQuestion17] = useState(
    JSON.parse(localStorage.getItem("question17"))
  )

  const [localQuestion18, setLocalQuestion18] = useState(
    JSON.parse(localStorage.getItem("question18"))
  )
  const [localQuestion19, setLocalQuestion19] = useState(
    JSON.parse(localStorage.getItem("question19"))
  )
  const [localQuestion20, setLocalQuestion20] = useState(
    JSON.parse(localStorage.getItem("question20"))
  )
  const [localQuestion21, setLocalQuestion21] = useState(
    JSON.parse(localStorage.getItem("question21"))
  )
  const [localQuestion22, setLocalQuestion22] = useState(
    JSON.parse(localStorage.getItem("question22"))
  )
  const [localQuestion23, setLocalQuestion23] = useState(
    JSON.parse(localStorage.getItem("question23"))
  )
  const [localQuestion24, setLocalQuestion24] = useState(
    JSON.parse(localStorage.getItem("question24"))
  )
  const [localQuestion25, setLocalQuestion25] = useState(
    JSON.parse(localStorage.getItem("question25"))
  )
  const [localQuestion26, setLocalQuestion26] = useState(
    JSON.parse(localStorage.getItem("question26"))
  )
  const [localQuestion27, setLocalQuestion27] = useState(
    JSON.parse(localStorage.getItem("question27"))
  )
  const [localQuestion28, setLocalQuestion28] = useState(
    JSON.parse(localStorage.getItem("question28"))
  )
  const [localQuestion29, setLocalQuestion29] = useState(
    JSON.parse(localStorage.getItem("question29"))
  )
  const [localQuestion30, setLocalQuestion30] = useState(
    JSON.parse(localStorage.getItem("question30"))
  )
  const [localQuestion31, setLocalQuestion31] = useState(
    JSON.parse(localStorage.getItem("question31"))
  )
  const [localQuestion32, setLocalQuestion32] = useState(
    JSON.parse(localStorage.getItem("question32"))
  )
  const [localQuestion33, setLocalQuestion33] = useState(
    JSON.parse(localStorage.getItem("question33"))
  )
  const [localQuestion34, setLocalQuestion34] = useState(
    JSON.parse(localStorage.getItem("question34"))
  )
  const [localQuestion35, setLocalQuestion35] = useState(
    JSON.parse(localStorage.getItem("question35"))
  )
  const [localQuestion36, setLocalQuestion36] = useState(
    JSON.parse(localStorage.getItem("question36"))
  )
  const [localQuestion37, setLocalQuestion37] = useState(
    JSON.parse(localStorage.getItem("question37"))
  )
  const [localQuestion38, setLocalQuestion38] = useState(
    JSON.parse(localStorage.getItem("question38"))
  )
  const [localQuestion39, setLocalQuestion39] = useState(
    JSON.parse(localStorage.getItem("question39"))
  )
  const [localQuestion40, setLocalQuestion40] = useState(
    JSON.parse(localStorage.getItem("question40"))
  )
  const [localQuestion41, setLocalQuestion41] = useState(
    JSON.parse(localStorage.getItem("question41"))
  )
  const [localQuestion42, setLocalQuestion42] = useState(
    JSON.parse(localStorage.getItem("question42"))
  )
  const [localQuestion43, setLocalQuestion43] = useState(
    JSON.parse(localStorage.getItem("question43"))
  )
  const [localQuestion44, setLocalQuestion44] = useState(
    JSON.parse(localStorage.getItem("question44"))
  )
  const [localQuestion45, setLocalQuestion45] = useState(
    JSON.parse(localStorage.getItem("question45"))
  )
  const [submitQuestion, setSubmitQuestion] = useState(
    JSON.parse(localStorage.getItem("questionno20"))
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

  const [questionsAddOneByOne, setQuestionsAddOneByOne] = useState([])
  const queshandleChange = e => {
    const { name, value } = e.target
    setquestions(prev => ({ ...prev, [name]: value }))
  }

  const myarr = []
  const pushhandler = () => {
    myarr.push(questions)
    console.log(myarr, "ggg")
    setarr(myarr)

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
  }
  const [duration, setDuration] = useState([
    { value: "0", label: "30".toUpperCase() },
    { value: "1", label: "45".toUpperCase() },
    { value: "2", label: "60".toUpperCase() },
  ])

  const [noOfQuestion, setNoOfQuestion] = useState([
    { value: "0", label: "20 Question".toUpperCase() },
    { value: "1", label: "35 Question".toUpperCase() },
    { value: "2", label: "45 Question".toUpperCase() },
  ])

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
    // TestApi.ViewTestQuiz({
    //   // "test_id":"272"
    //   "test_id":"272"
    // }).then(resp => {
    //   setViewQuestion(resp.data.test)
    //   // setViewQuestion([])
    // })
    // .catch(err => {
    //   console.log(err)
    // })
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
  const classListOption = user?.teacher_subject?.map(cl => {
    return {
      value: cl.UID,
      label: `${cl.st_class}`,
    }
  })
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
      session_id: sessionId,
      time_data: profileQuestion.time_data,
      ttrue: "True",
      tfalse: "False",
      test_name: user?.payload?.t_name,
      st_class: profileQuestion.st_class,
      subject: profileQuestion.subject,
      duration: profileQuestion.duration,
      no_of_question: profileQuestion.no_of_question,
      start_date: profileQuestion.start_date,
      question_number: "",
      answer: "",
      question: [
        localQuestion
          ? localQuestion
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion1
          ? localQuestion1
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion2
          ? localQuestion2
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion3
          ? localQuestion3
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion4
          ? localQuestion4
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion5
          ? localQuestion5
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion6
          ? localQuestion6
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion7
          ? localQuestion7
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion8
          ? localQuestion8
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion9
          ? localQuestion9
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion10
          ? localQuestion10
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion11
          ? localQuestion11
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion12
          ? localQuestion12
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion13
          ? localQuestion13
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion14
          ? localQuestion14
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion15
          ? localQuestion15
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion16
          ? localQuestion16
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion17
          ? localQuestion17
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion18
          ? localQuestion18
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion19
          ? localQuestion19
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion20
          ? localQuestion20
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion21
          ? localQuestion21
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion22
          ? localQuestion22
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion23
          ? localQuestion23
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion24
          ? localQuestion24
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion25
          ? localQuestion25
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion26
          ? localQuestion26
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion27
          ? localQuestion27
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion28
          ? localQuestion28
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion29
          ? localQuestion29
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion30
          ? localQuestion30
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion31
          ? localQuestion31
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion32
          ? localQuestion32
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion33
          ? localQuestion33
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion34
          ? localQuestion34
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion35
          ? localQuestion35
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion36
          ? localQuestion36
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion37
          ? localQuestion37
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion38
          ? localQuestion38
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion39
          ? localQuestion39
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion40
          ? localQuestion40
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion41
          ? localQuestion41
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion42
          ? localQuestion42
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion43
          ? localQuestion43
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
        localQuestion44
          ? localQuestion44
          : {
              is_dummy: "True",
              question_answer: "",
              media: "",
              single_choice: "",
              fillinblanks: "",
              true_false: "",
              option: "",
              answer: "",
            },
      ],
      teacher_code: user?.payload?.t_code,
      added_by: user == "Admin" ? "Admin" : "Teacher",
    },
    validationSchema: Yup.object().shape({
      //   time_data: Yup.string().required("This is required"),
      //   test_name: Yup.string().required("This is required"),
      //   st_class: Yup.string().required("This is required"),
      //   subject: Yup.string().required("This is required"),
      //   duration: Yup.string().required("This is required"),
      //   no_of_question: Yup.string().required("This is required"),
      //   start_date: Yup.string().required("This is required"),
      //   teacher_code: Yup.string().required("This is required"),
      //   added_by: Yup.string().required("This is required"),
    }),
    onSubmit: async values => {
      if (singleChoice === true) {
        values.question_data
          ? setSingleChoiceQuestion("")
          : setSingleChoiceQuestion("this is required")
        values.answer
          ? setOptQAnswer("")
          : setOptQAnswer("please choose the correct answer")
        values.op1 ? setOp1valid("") : setOp1valid("this is required")
        values.op2 ? setOp2valid("") : setOp2valid("this is required")
        values.op3 ? setOp3valid("") : setOp3valid("this is required")
        values.op4 ? setOp4valid("") : setOp4valid("this is required")

        if (
          !values.question_data ||
          !values.answer ||
          !values.op1 ||
          !values.op2 ||
          !values.op3 ||
          !values.op4
        ) {
          return
        }
      }

      if (fileIBValid === true) {
        values.fquestion_data
          ? setFillInTheBlankQuestion("")
          : setFillInTheBlankQuestion("this is required")
        values.answer
          ? setOptQAnswer("")
          : setOptQAnswer("please choose the correct answer")
        values.fop1 ? setfOp1valid("") : setfOp1valid("this is required")
        values.fop2 ? setfOp2valid("") : setfOp2valid("this is required")
        values.fop3 ? setfOp3valid("") : setfOp3valid("this is required")
        values.fop4 ? setfOp4valid("") : setfOp4valid("this is required")

        if (
          !values.fquestion_data ||
          !values.answer ||
          !values.fop1 ||
          !values.fop2 ||
          !values.fop3 ||
          !values.fop4
        ) {
          return
        }
      }

      if (trueFalseValid === true) {
        values.tfquestion_data
          ? setTrueFalseQuestion("")
          : setTrueFalseQuestion("this is required")
        values.answer
          ? setOptQAnswer("")
          : setOptQAnswer("please choose the correct answer")

        if (!values.tfquestion_data || !values.answer) {
          return
        }
      }
      //

      setQuestionCount(questionCount + 1)
      values.media = (await fileData) ? fileData : ""
      let getData = []
      let getfillInTheBlack = []
      let getTrueAndFalse = ["True", "False"]
      if (
        values.op1 != "" &&
        values.op2 != "" &&
        values.op3 != "" &&
        values.op4 != ""
      ) {
        getData = [values.op1, values.op2, values.op3, values.op4]
      }

      if (
        values.fop1 != "" &&
        values.fop2 != "" &&
        values.fop3 != "" &&
        values.fop4 != ""
      ) {
        getfillInTheBlack = [values.fop1, values.fop2, values.fop3, values.fop4]
      }

      const setquestions = {
        is_dummy: "False",
        question_answer: values.answer,
        question: values.question_data
          ? values.question_data
          : values.fquestion_data
          ? values.fquestion_data
          : values.tfquestion_data,
        media: values.media,
        single_choice: "True",
        fillinblanks: "False",
        true_false: "True",
        option:
          getData.length !== 0
            ? getData
            : getfillInTheBlack.length !== 0
            ? getfillInTheBlack
            : getTrueAndFalse,
        answer: values.answer,
      }
      // setQuestionsAddOneByOne(setquestions)
      if (!submitQuestion) {
        setQuestionsAddOneByOne(questionsAddOneByOne => [
          ...questionsAddOneByOne,
          setquestions,
        ])
      }

      await localStorage.setItem(
        "question" + questionCount,
        JSON.stringify(setquestions)
      )
      // Swal.fire({
      //   title: "Are you sure?",
      //   text: "20 question done",
      //   icon: "warning",
      //   showCancelButton: true,
      //   confirmButtonColor: "#3085d6",
      //   cancelButtonColor: "#f46a6a",
      //   confirmButtonText: "confirm submit",
      // }).then(result => {
      //   if (result.isConfirmed) {
      //     localStorage.setItem(
      //       "questionno20",
      //       JSON.stringify("20 question")
      //     )
      //   }
      // })

      if (profileQuestion.no_of_question === "20 QUESTION") {
        // if(!submitQuestion)
        // {
        if (questionCount === 19) {
          Swal.fire({
            title: "are you sure",
            text: "20 question done",
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "confirm submit",
          }).then(result => {
            if (result.isConfirmed) {
              if (!submitQuestion) {
                localStorage.setItem(
                  "questionno20",
                  JSON.stringify("20 question")
                )
                window.location.href = "/add-question"
              } else {
                localStorage.setItem(
                  "questionno20",
                  JSON.stringify("20 question")
                )
              }
            }
          })
        }
        // }

        if (
          localQuestion &&
          localQuestion1 &&
          localQuestion2 &&
          localQuestion3 &&
          localQuestion4 &&
          localQuestion5 &&
          localQuestion6 &&
          localQuestion7 &&
          localQuestion8 &&
          localQuestion9 &&
          localQuestion10 &&
          localQuestion11 &&
          localQuestion12 &&
          localQuestion13 &&
          localQuestion14 &&
          localQuestion15 &&
          localQuestion16 &&
          localQuestion17 &&
          localQuestion18 &&
          localQuestion19
        ) {
          if (submitQuestion) {
            TestApi.createTestQuiz(values)
            window.localStorage.removeItem("questionno20")
            window.localStorage.removeItem("profileQuestion")
            Swal.fire({
              text: "test created successfully",
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/test"
              }
            })
          }
        }
      }
      if (profileQuestion.no_of_question === "35 QUESTION") {
        if (questionCount === 34) {
          Swal.fire({
            title: "are you sure",
            text: "35 question done",
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "confirm submit",
          }).then(result => {
            if (result.isConfirmed) {
              if (!submitQuestion) {
                localStorage.setItem(
                  "questionno20",
                  JSON.stringify("20 question")
                )
                window.location.href = "/add-question"
              } else {
                localStorage.setItem(
                  "questionno20",
                  JSON.stringify("20 question")
                )
              }
            }
          })
        }
        if (
          localQuestion &&
          localQuestion1 &&
          localQuestion2 &&
          localQuestion3 &&
          localQuestion4 &&
          localQuestion5 &&
          localQuestion6 &&
          localQuestion7 &&
          localQuestion8 &&
          localQuestion9 &&
          localQuestion10 &&
          localQuestion11 &&
          localQuestion12 &&
          localQuestion13 &&
          localQuestion14 &&
          localQuestion15 &&
          localQuestion16 &&
          localQuestion17 &&
          localQuestion18 &&
          localQuestion19 &&
          localQuestion20 &&
          localQuestion21 &&
          localQuestion22 &&
          localQuestion23 &&
          localQuestion24 &&
          localQuestion25 &&
          localQuestion26 &&
          localQuestion27 &&
          localQuestion28 &&
          localQuestion29 &&
          localQuestion30 &&
          localQuestion31 &&
          localQuestion32 &&
          localQuestion33 &&
          localQuestion34
        ) {
          if (submitQuestion) {
            TestApi.createTestQuiz(values)
            window.localStorage.removeItem("questionno20")
            window.localStorage.removeItem("profileQuestion")
            Swal.fire({
              text: "test created successfully",
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/test"
              }
            })
          }
        }
      }

      if (profileQuestion.no_of_question === "45 QUESTION") {
        if (questionCount === 44) {
          Swal.fire({
            title: "are you sure",
            text: "45 question done",
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "confirm submit",
          }).then(result => {
            if (result.isConfirmed) {
              if (!submitQuestion) {
                localStorage.setItem(
                  "questionno20",
                  JSON.stringify("20 question")
                )
                window.location.href = "/add-question"
              } else {
                localStorage.setItem(
                  "questionno20",
                  JSON.stringify("20 question")
                )
              }
            }
          })
        }
        if (
          localQuestion &&
          localQuestion1 &&
          localQuestion2 &&
          localQuestion3 &&
          localQuestion4 &&
          localQuestion5 &&
          localQuestion6 &&
          localQuestion7 &&
          localQuestion8 &&
          localQuestion9 &&
          localQuestion10 &&
          localQuestion11 &&
          localQuestion12 &&
          localQuestion13 &&
          localQuestion14 &&
          localQuestion15 &&
          localQuestion16 &&
          localQuestion17 &&
          localQuestion18 &&
          localQuestion19 &&
          localQuestion20 &&
          localQuestion21 &&
          localQuestion22 &&
          localQuestion23 &&
          localQuestion24 &&
          localQuestion25 &&
          localQuestion26 &&
          localQuestion27 &&
          localQuestion28 &&
          localQuestion29 &&
          localQuestion30 &&
          localQuestion31 &&
          localQuestion32 &&
          localQuestion33 &&
          localQuestion34 &&
          localQuestion35 &&
          localQuestion36 &&
          localQuestion37 &&
          localQuestion38 &&
          localQuestion39 &&
          localQuestion40 &&
          localQuestion41 &&
          localQuestion42 &&
          localQuestion43 &&
          localQuestion44
        ) {
          if (submitQuestion) {
            TestApi.createTestQuiz(values)
            window.localStorage.removeItem("questionno20")
            window.localStorage.removeItem("profileQuestion")
            Swal.fire({
              text: "test created successfully",
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/test"
              }
            })
          }
          // TestApi.createTestQuiz(values)
        }
      }
      values.op1 = ""
      formClear()
      return
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
                      {/* {!submitQuestion === 3 ? ( */}
                        <>
                          {/* <div style={{ textAlign: "center" }}>
                            {" "}
                            now you can submit your question<br></br>
                            <Button
                              type="submit"
                              // onClick={e => pushhandler()}

                              className="btn btn-primary me-1  "
                              style={{ textAlign: "center" }}
                            >
                              Submit
                            </Button>
                          </div> */}
                        </>
                      {/* ) : ( */}
                        <>
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
                                    disabled
                                    name="test_name"
                                    placeholder={profileQuestion.test_name}
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
                          <Row>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">Subjects</Label>
                                <Input
                                  disabled
                                  name="test_name"
                                  placeholder={profileQuestion.subject}
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
                              </div>
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">Class</Label>
                                <Input
                                  disabled
                                  name="test_name"
                                  placeholder={profileQuestion.st_class}
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
                              </div>
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">
                                  No Of Question
                                </Label>
                                <Input
                                  disabled
                                  name="test_name"
                                  placeholder={profileQuestion.no_of_question}
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
                              </div>
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">
                                  Duration (Minutes)
                                </Label>
                                <Input
                                  disabled
                                  name="test_name"
                                  placeholder={profileQuestion.duration}
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
                              </div>
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">
                                  Date and Time
                                </Label>
                                <Input
                                  disabled
                                  name="test_name"
                                  // {moment(item.created_date).format(
                                  //   "DD-MM-YYYY , hh:mm A"
                                  // )}
                                  placeholder={moment(
                                    profileQuestion.start_date_only
                                  ).format("DD-MM-YYYY ")}
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
                              </div>
                            </Col>
                            <Col sm={3}>
                              <div className="mb-3 form-check">
                                <Label className="form-label">Time</Label>
                                <Input
                                  disabled
                                  name="test_name"
                                  placeholder={profileQuestion.time_data}
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
                              </div>
                            </Col>
                          </Row>
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
                                  onClick={() => {
                                    setSingleChoice(true),
                                      setTrueFalseValid(false),
                                      setfileIBValid(false)
                                  }}
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
                                  onClick={() => {
                                    setSingleChoice(false),
                                      setTrueFalseValid(true),
                                      setfileIBValid(false)
                                  }}
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
                                  onClick={() => {
                                    setSingleChoice(false),
                                      setTrueFalseValid(false),
                                      setfileIBValid(true)
                                  }}
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
                                  <p className="fs-6">

                                    {questionCount}/
                                    {profileQuestion.no_of_question}
                                    {/* {profileQuestion.no_of_question ===
                                    "20 QUESTION"
                                      ? "20"
                                      : profileQuestion.no_of_question ===
                                        "35 QUESTION"
                                      ? "35"
                                      : "45"}{" "} */}
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
                                    <h5 className="ms-5 my-control">
                                      Question
                                    </h5>
                                  </label>
                                  <div className="col-md-10">
                                    <Input
                                      name="question_data"
                                      rows="2"
                                      placeholder="Please Add Question....."
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
                                    <div
                                      style={{
                                        color: "#f46a6a",
                                        fontSize: "11px",
                                        marginTop: "3px",
                                      }}
                                    >
                                      <span style={{}}>
                                        {singleChoiceQuestion}
                                      </span>
                                    </div>
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
                                          name="originalFileName"
                                          style={{ width: "794px" }}
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
                                    <div
                                      style={{
                                        color: "#f46a6a",
                                        fontSize: "11px",
                                        marginTop: "3px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          float: "right",
                                          marginRight: "100px",
                                        }}
                                      >
                                        {optqAnswer}
                                      </span>
                                    </div>
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
                                          className="form-control me-auto"
                                          type="text"
                                          name="op1"
                                          value={
                                            validationType?.values?.op1 || ""
                                          }
                                          onChange={validationType.handleChange}
                                          onKeyUp={() =>
                                            setOp1valid(
                                              validationType?.values?.op1
                                                ? ""
                                                : "this is required"
                                            )
                                          }
                                          // onKeyUp={() => console.log(validationType?.values?.op1)}
                                          // onChange={ () => {validationType.handleChange,setOp1valid(validationType?.values?.op1 ? "" : "this is required")}}
                                          // onChange={() => { validationType.handleChange; setSCOpt1(validationType?.values?.op1) }}
                                          // onDoubleClick={handleChange},setSCOpt1(validationType?.values?.op1)
                                          placeholder="Option"
                                          aria-label="Add your item here..."
                                        />
                                        {/* <i className="far fa-image"></i> */}
                                        <input
                                          type="radio"
                                          name="answer"
                                          value={
                                            validationType?.values?.op1 || ""
                                          }
                                          // checked={checkedValue}
                                          // checked={checkedValueOp1}
                                          // checked
                                          // value={
                                          //   validationType?.values?.answer || ""
                                          // }
                                          onChange={validationType.handleChange}
                                        />{" "}
                                        {/* <div
                                    style={{
                                      color: "#f46a6a",
                                      fontSize: "11px",
                                      marginTop: "3px",
                                    }}
                                  >
                                    { validationType?.values?.op1 ? "this is required" : ""}
                                  </div> */}
                                        Correct
                                        {/* <i className="far fa-times-circle"></i> */}
                                        <br />
                                      </div>
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "11px",
                                          marginTop: "3px",
                                        }}
                                      >
                                        {op1valid ? "this is required" : ""}
                                        {/* { optqAnswer ? "" : <span style={{float: "right"}}>this is required</span>}
                                    { optqAnswer ? "" : <span style={{float: "right"}}>this is required</span>} */}
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
                                          onKeyUp={() =>
                                            setOp2valid(
                                              validationType?.values?.op2
                                                ? ""
                                                : "this is required"
                                            )
                                          }
                                          placeholder="Option"
                                          aria-label="Add your item here..."
                                        />
                                        {/* <i className="far fa-image"></i> */}
                                        <input
                                          type="radio"
                                          name="answer"
                                          value={
                                            validationType?.values?.op2 || ""
                                          }
                                          // checked={checkedValueOp2}
                                          onChange={validationType.handleChange}
                                        />{" "}
                                        Correct
                                        {/* <i className="far fa-times-circle"></i> */}
                                        <br />
                                      </div>
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "11px",
                                          marginTop: "3px",
                                        }}
                                      >
                                        {op2valid ? "this is required" : ""}
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
                                          onKeyUp={() =>
                                            setOp3valid(
                                              validationType?.values?.op3
                                                ? ""
                                                : "this is required"
                                            )
                                          }
                                          placeholder="Option"
                                          aria-label="Add your item here..."
                                        />
                                        {/* <i className="far fa-image"></i> */}
                                        <input
                                          type="radio"
                                          name="answer"
                                          // checked={checkedValueOp3}
                                          value={
                                            validationType?.values?.op3 || ""
                                          }
                                          onChange={validationType.handleChange}
                                        />{" "}
                                        Correct
                                        {/* <i className="far fa-times-circle"></i> */}
                                        <br />
                                      </div>
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "11px",
                                          marginTop: "3px",
                                        }}
                                      >
                                        {op3valid ? "this is required" : ""}
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
                                          onKeyUp={() =>
                                            setOp4valid(
                                              validationType?.values?.op4
                                                ? ""
                                                : "this is required"
                                            )
                                          }
                                          placeholder="Option"
                                          aria-label="Add your item here..."
                                        />
                                        {/* <i className="far fa-image"></i> */}
                                        <input
                                          type="radio"
                                          name="answer"
                                          // checked={checkedValueOp4}
                                          value={
                                            validationType?.values?.op4 || ""
                                          }
                                          onChange={validationType.handleChange}
                                        />
                                        Correct
                                        {/* <i className="far fa-times-circle"></i> */}
                                        <br />
                                      </div>
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "11px",
                                          marginTop: "3px",
                                        }}
                                      >
                                        {op4valid ? "this is required" : ""}
                                      </div>
                                    </Col>
                                    <br />
                                    <Button
                                      type="submit"
                                      // onClick={e => pushhandler()}
                                      className="btn btn-primary me-1  "
                                      id="ExampleTrigger"
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
                                    <h5 className="ms-5 my-control">
                                      Question
                                    </h5>
                                  </label>
                                  <div className="col-md-10">
                                    <Input
                                      name="fquestion_data"
                                      rows="2"
                                      placeholder="Please Add The Question"
                                      type="textarea"
                                      className="form-control"
                                      value={
                                        validationType?.values
                                          ?.fquestion_data || ""
                                      }
                                      onChange={validationType.handleChange}
                                    />
                                    <div
                                      style={{
                                        color: "#f46a6a",
                                        fontSize: "11px",
                                        marginTop: "3px",
                                      }}
                                    >
                                      <span style={{}}>
                                        {fillInTheBlankQuestion}
                                      </span>
                                    </div>
                                    {/* <textarea
                                  className="form-control"
                                  type="text"
                                  defaultValue="_____________ is The Capital Of India."
                                /> */}
                                    <label htmlFor="img">
                                      <h6>Upload Image</h6>
                                    </label>
                                    <Input
                                      type="file"
                                      className="form-control me-auto"
                                      id="img"
                                      name="originalFileName"
                                      style={{ width: "794px" }}
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
                                    {/* <input
                                    type="file"
                                    id="img"
                                    name="img"
                                    accept="image/*"
                                  /> */}
                                  </div>
                                  <div
                                    style={{
                                      color: "#f46a6a",
                                      fontSize: "11px",
                                      marginTop: "3px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        float: "right",
                                        marginRight: "89px",
                                      }}
                                    >
                                      {optqAnswer}
                                    </span>
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
                                          // onChange={handleChange}
                                          className="form-control me-auto"
                                          type="text"
                                          name="fop1"
                                          // onDoubleClick={handleChange}
                                          value={
                                            validationType?.values?.fop1 || ""
                                          }
                                          onChange={validationType.handleChange}
                                          placeholder="Option"
                                          aria-label="Add your item here..."
                                        />
                                        {/* <i className="far fa-image"></i> */}
                                        <input
                                          type="radio"
                                          name="answer"
                                          value={
                                            validationType?.values?.fop1 || ""
                                          }
                                          onChange={validationType.handleChange}
                                        />{" "}
                                        Correct
                                        {/* <i className="far fa-times-circle"></i> */}
                                        <br />
                                      </div>
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "11px",
                                          marginTop: "3px",
                                        }}
                                      >
                                        {fop1valid ? "this is required" : ""}
                                        {/* { optqAnswer ? "" : <span style={{float: "right"}}>this is required</span>}
                                    { optqAnswer ? "" : <span style={{float: "right"}}>this is required</span>} */}
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
                                          placeholder="Option"
                                          aria-label="Add your item here..."
                                        />
                                        {/* <i className="far fa-image"></i> */}
                                        <input
                                          type="radio"
                                          name="answer"
                                          value={
                                            validationType?.values?.fop2 || ""
                                          }
                                          onChange={validationType.handleChange}
                                        />{" "}
                                        Correct
                                        {/* <i className="far fa-times-circle"></i> */}
                                        <br />
                                      </div>
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "11px",
                                          marginTop: "3px",
                                        }}
                                      >
                                        {fop2valid ? "this is required" : ""}
                                        {/* { optqAnswer ? "" : <span style={{float: "right"}}>this is required</span>}
                                    { optqAnswer ? "" : <span style={{float: "right"}}>this is required</span>} */}
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
                                          placeholder="Option"
                                          aria-label="Add your item here..."
                                        />{" "}
                                        {/* <i className="far fa-image"></i> */}
                                        <input
                                          type="radio"
                                          name="answer"
                                          value={
                                            validationType?.values?.fop3 || ""
                                          }
                                          onChange={validationType.handleChange}
                                        />{" "}
                                        Correct
                                        {/* <i className="far fa-times-circle"></i> */}
                                        <br />
                                      </div>
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "11px",
                                          marginTop: "3px",
                                        }}
                                      >
                                        {fop3valid ? "this is required" : ""}
                                        {/* { optqAnswer ? "" : <span style={{float: "right"}}>this is required</span>}
                                    { optqAnswer ? "" : <span style={{float: "right"}}>this is required</span>} */}
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
                                          placeholder="Option"
                                          aria-label="Add your item here..."
                                        />
                                        {/* <i className="far fa-image"></i> */}
                                        <input
                                          type="radio"
                                          name="answer"
                                          value={
                                            validationType?.values?.fop4 || ""
                                          }
                                          onChange={validationType.handleChange}
                                        />
                                        Correct
                                        {/* <i className="far fa-times-circle"></i> */}
                                        <br />
                                      </div>
                                      <div
                                        style={{
                                          color: "#f46a6a",
                                          fontSize: "11px",
                                          marginTop: "3px",
                                        }}
                                      >
                                        {fop4valid ? "this is required" : ""}
                                        {/* { optqAnswer ? "" : <span style={{float: "right"}}>this is required</span>}
                                    { optqAnswer ? "" : <span style={{float: "right"}}>this is required</span>} */}
                                      </div>
                                    </Col>
                                    <br />
                                    <Button
                                      type="submit"
                                      onClick={e => pushhandler()}
                                      className="btn btn-primary me-1  "
                                      id="ExampleTrigger1"
                                    >
                                      ADD
                                    </Button>
                                  </div>
                                </Row>
                              </div>
                            )}

                            {selectedOption === "option2" && (
                              <div className="option2">
                                <Row className="mb-3">
                                  <label
                                    htmlFor="example-text-input"
                                    className="col-md-2 col-form-label"
                                  >
                                    <h5 className="ms-5 my-control">
                                      Question
                                    </h5>
                                  </label>
                                  <div className="col-md-10">
                                    <Input
                                      name="tfquestion_data"
                                      rows="2"
                                      placeholder="Please Add The Question"
                                      type="textarea"
                                      className="form-control"
                                      value={
                                        validationType?.values
                                          ?.tfquestion_data || ""
                                      }
                                      onChange={validationType.handleChange}
                                    />
                                    <div
                                      style={{
                                        color: "#f46a6a",
                                        fontSize: "11px",
                                        marginTop: "3px",
                                      }}
                                    >
                                      <span style={{}}>
                                        {trueFalseQuestion}
                                      </span>
                                    </div>
                                    {/* <textarea
                                  className="form-control"
                                  type="text"
                                  defaultValue="Is Delhi Capital Of India ?"
                                /> */}
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
                                  <div
                                    style={{
                                      color: "#f46a6a",
                                      fontSize: "11px",
                                      marginTop: "3px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        float: "right",
                                        marginRight: "89px",
                                      }}
                                    >
                                      {optqAnswer}
                                    </span>
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
                                          name="ttrue"
                                          value={
                                            validationType?.values?.ttrue || ""
                                          }
                                          placeholder="True"
                                          aria-label="Add your item here..."
                                        />
                                        <input
                                          type="radio"
                                          name="answer"
                                          value={
                                            validationType?.values?.ttrue || ""
                                          }
                                          onChange={validationType.handleChange}
                                        />{" "}
                                        Correct
                                        {/* <i className="far fa-times-circle"></i> */}
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
                                          name="tfalse"
                                          value={
                                            validationType?.values?.tfalse || ""
                                          }
                                          aria-label="Add your item here..."
                                        />
                                        <input
                                          type="radio"
                                          name="answer"
                                          value={
                                            validationType?.values?.tfalse || ""
                                          }
                                          onChange={validationType.handleChange}
                                        />{" "}
                                        Correct
                                        {/* <i className="far fa-times-circle"></i> */}
                                        <br />
                                      </div>
                                    </Col>
                                    <br />

                                    <br />
                                    <Button
                                      type="submit"
                                      onClick={e => pushhandler()}
                                      className="btn btn-primary me-1  "
                                      id="ExampleTrigger2"
                                    >
                                      ADDD
                                    </Button>
                                  </div>
                                </Row>
                              </div>
                            )}
                          </div>
                        </>
                      {/* )} */}
                    </CardBody>

                    {/* {viewQuestion[0]?.question?.map((item, index) => (
                      <>
                        <Row className="mb-3" key={item.id}>
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

                                <i className="far fa-edit m-2"></i>
                                <i className="far fa-trash-alt "></i>
                                <br />
                              </div>
                            </Col>
                          
                          </div>
                        </Row>

                        <div className="container">
                          <div className="col-sm-11 mx-auto">
                            {item?.option?.map((opt, id) => (
                              <label
                                className="radio-inline ms-4"
                                key={item.id}
                              >
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
                              Answer : {item.question_answer}
                            </sapn>
                          </div>
                        </div>
                      </>
                    ))} */}

                    {questionsAddOneByOne?.map((item, index) => (
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

                                {/* <i className="far fa-edit m-2"></i>
                                <i className="far fa-trash-alt "></i> */}
                                <br />
                              </div>
                            </Col>
                          </div>
                        </Row>

                        <div className="container">
                          <div className="col-sm-11 mx-auto">
                            {item?.option?.map((opt, id) => (
                              <label className="radio-inline ms-4" key={id}>
                                <input
                                  disabled
                                  type="radio"
                                  name="season"
                                  id="seasonSummer"
                                  value="summer"
                                />{" "}
                                {opt}{" "}
                              </label>
                            ))}

                            <br></br>
                            <sapn style={{ marginLeft: "14px" }}>
                              Answer : {item.question_answer}
                            </sapn>
                          </div>
                        </div>
                      </>
                    ))}
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
                      // <br />
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
                      // <br />
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

export default AddQuestion
