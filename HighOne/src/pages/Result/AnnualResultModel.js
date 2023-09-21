import React, { useEffect, useState } from "react"
// import { Link, withRouter } from "react-router-dom";
import withRouter from "components/Common/withRouter"

import {
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  Label,
  Card,
  CardBody,
  Button,
  FormFeedback,
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import { classApi } from "apis/ClassListApi"
import { NotesApi } from "apis/NotesApi"
import Swal from "sweetalert2"

const AnnualResultmodel = props => {
  const { classListOption, teacher_code, t_name, teacher_profile } = props
  const [classL, setClassL] = useState("")
  const [sectionL, setSectionL] = useState("")
  const [section, setSection] = useState([])
  const [teachersubject, setTeacherSubject] = useState([])
  // console.log(classListOption , "from model")

  let classList = classListOption?.filter((list, index, arr) => {
    return index === arr.findIndex(d => d.label === list.label)
  })
  let filterSectionList = section?.filter((list, index, arr) => {
    return index === arr.findIndex(d => d.st_sec === list.st_sec)
  })

  //  console.log(classList,'from model')
  useEffect(() => {
    let data = {
      t_code: teacher_code,
      st_class: classL,
    }
    NotesApi.getClasswiseSection(data)
      .then(res => {
        setSection(res.data.section)
      })
      .catch(err => console.log(err))
  }, [classL])

  useEffect(() => {
    let data = {
      t_code: teacher_code,
      st_class: classL,
      st_sec: sectionL,
    }
    classApi
      .getTeacherSubject(data)
      .then(res => {
        setTeacherSubject(res.data.subject)
      })
      .catch(err => {
        console.log(err)
      })
  }, [classL, sectionL])

  let handleClassChange = e => {
    setClassL(e.target.value)
  }
  let handleSectionChange = e => {
    setSectionL(e.target.value)
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      teacher_code: teacher_code,
      teacher_name: t_name,
      chapter: "",
      st_class: classL,
      st_section: sectionL,
      subject: "",
      notes1: "",
      lession: "",
      teacher_profile: teacher_profile,
    },
    validationSchema: Yup.object({
      chapter: Yup.string().required("Please Enter Your Chapter"),
      lession: Yup.string().required("Please Enter Your Lesson"),
      st_class: Yup.string().required("Please Enter Your Class"),
      st_section: Yup.string().required("Please Enter Your Section"),
      subject: Yup.string().required("Please Enter Your Subject"),
      notes1: Yup.mixed()
        .test(
          "fileSize",
          "File size exceeds the limit of 5 MB.",
          value => !value || value.size <= MAX_FILE_SIZE
        )
        .required("Please upload a PDF file."),
    }),
    onSubmit: values => {
      const data = new FormData()
      data.append("teacher_code", values.teacher_code)
      data.append("chapter", values.chapter)
      data.append("st_class", values.st_class.toLowerCase() + " " + values.st_section)
      data.append("subject", values.subject)
      data.append("notes1", values.notes1)
      data.append("teacher_name", values.teacher_name)
      data.append("teacher_profile", values.teacher_profile)
      data.append("lession", values.lession)

      NotesApi.createNotes(data)
        .then(res => {
          if (res.data.status === 200) {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/notes"
                toggle()
                // formClear()
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
  })

  const [modal, setModal] = useState(false)

  const toggle = () => {
    if (modal) {
      formClear()
      setClassL("")
      setSectionL("")
      setModal(false)
    } else {
      setModal(true)
    }
  }

  const formClear = () => {
    validation.resetForm()
  }

  const handleProjectClick = arg => {
    toggle()
  }

  return (
    <React.Fragment>
      <Row>
        <Col lg="12">
          <Card className="bg-transparent shadow-none pt-0">
            <CardBody className="p-0 text-end">
              <Button
                onClick={() => handleProjectClick()}
                color="primary"
                className="btn btn-primary waves-effect waves-light"
              >
                <i className="bx bxs-add-to-queue p-1"></i>
                Add Result
              </Button>
            </CardBody>
          </Card>
          <div>
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle} tag="h4">
                Add Annual Result
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={e => {
                    e.preventDefault()
                    validation.handleSubmit()
                    return false
                  }}
                >
                  <Row>
                    <Col sm={12}>
                      <Row>
                        <Col sm={6}>
                          {" "}
                          <div className="mb-2">
                            <Label className="form-label my-control">
                              Class
                            </Label>
                            <select
                              name="st_class"
                              type="select"
                              className="form-select"
                              onChange={handleClassChange}
                              onBlur={validation.onBlur}
                              value={validation.values.st_class}
                            >
                              <option value="">Select Class</option>
                              {classList?.map(class1 => (
                                <option key={class1.value}>
                                  {class1.label.toUpperCase()}
                                </option>
                              ))}
                            </select>
                            {validation.touched.st_class &&
                            validation.errors.st_class ? (
                              <div
                                style={{
                                  color: "red",
                                  fontSize: "11px",
                                  marginTop: "3px",
                                }}
                              >
                                {validation.errors.st_class}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col sm={6}>
                          {" "}
                          <div className="mb-2">
                            <Label className="form-label my-control">
                              Section
                            </Label>

                            <select
                              name="st_section"
                              type="select"
                              className="form-select"
                              onChange={handleSectionChange}
                              onBlur={validation.onBlur}
                              value={validation.values.st_section}
                            >
                              <option value="">Select Section</option>
                              {filterSectionList?.map((class1, index) => (
                                <option key={index}>{class1.st_sec}</option>
                              ))}
                            </select>
                            {validation.touched.st_section &&
                            validation.errors.st_section ? (
                              <div
                                style={{
                                  color: "red",
                                  fontSize: "11px",
                                  marginTop: "3px",
                                }}
                              >
                                {validation.errors.st_section}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                      </Row>

                      <div className="mb-2">
                        <Label className="form-label my-control">Student Name</Label>
                        <select
                          name="subject"
                          type="select"
                          className="form-select"
                          onChange={validation.handleChange}
                          onBlur={validation.onBlur}
                          value={validation.values.subject}
                        >
                          <option value="">Select Name</option>
                          {teachersubject?.map((sub, index) => (
                            <option key={index} value={sub.subject_name}>
                              {sub.subject_name}
                            </option>
                          ))}
                        </select>
                        {validation.touched.subject &&
                        validation.errors.subject ? (
                          <div
                            style={{
                              color: "#f46a6a",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            {validation.errors.subject}
                          </div>
                        ) : null}
                      </div>
                      {/* <div className="mb-3">
                        <Label htmlFor="n_title" className="my-control">
                          Student Name
                        </Label>
                        <Input
                          id="n_title"
                          name="lession"
                          type="text"
                          className="form-control"
                          placeholder="Lesson"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.lession}
                          invalid={
                            validation.touched.lession &&
                            validation.errors.lession
                              ? true
                              : false
                          }
                        />
                        {validation.touched.lession &&
                        validation.errors.lession ? (
                          <FormFeedback type="invalid">
                            {validation.errors.lession}
                          </FormFeedback>
                        ) : null}
                      </div> */}
                      <div className="mt-0">
                      <Label className="form-label my-control">
                          Upload pdf
                        </Label>
                        <div className="input-group">
                          <Input
                            name="notes1"
                            type="file"
                            className="form-control"
                            id="inputGroupFile02"
                            accept=".pdf"
                            onChange={e => {
                              // setFiles1(e.target.files[0]);
                              validation.setFieldValue(
                                "notes1",
                                e.target.files[0]
                              )
                            }}
                            invalid={
                              validation.touched.notes1 &&
                              validation.errors.notes1
                                ? true
                                : false
                            }
                          />

                          {/* <Label
                            className="input-group-text"
                            htmlFor="inputGroupFile02"
                          >
                            Upload
                          </Label> */}
                        </div>
                        {validation.touched.notes1 &&
                        validation.errors.notes1 ? (
                          <div
                            style={{
                              color: "red",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            {validation.errors.notes1}
                          </div>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-end pt-5">
                        <button
                          type="submit"
                          className="btn btn-success save-user"
                        >
                          Add
                        </button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </ModalBody>
            </Modal>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default AnnualResultmodel
