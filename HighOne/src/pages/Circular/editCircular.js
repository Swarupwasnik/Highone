import React, { useContext, useEffect, useState } from "react"
import {  useParams } from "react-router-dom"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import {
  Col,
  Container,
  Row,
  Form,
  Input,
  Label,
  Card,
  CardBody,
  Button,
  FormFeedback,
  CardTitle,
} from "reactstrap"
import * as Yup from "yup"
import Select from "react-select"
import { useFormik } from "formik"
import { classApi } from "apis/ClassListApi"
import Swal from "sweetalert2"
import { CircularApi } from "apis/CircularAPI"
import config from "config/config"
import { SessionContext } from "context/sessionContext"
import Loading from "components/Loading"

const EditCircular = props => {
  document.title = "Edit Circular"
  const [classselected, setClassSelected] = useState([])
  const [circular, setCircular] = useState([])
  const [selected, setSelected] = useState([])
  const [title, setTitle] = useState("")
  const [descri, setdescri] = useState("")
  const [classList, setClassList] = useState([])
  const [files1, setFiles1] = useState([])
  const [loading, setloading] = useState(false)
  const {Session}=useContext(SessionContext)
  let session= Session || sessionStorage.getItem("SessionId");
  const { id } = useParams()

  let cid = {
    circular_id: id,
  }
  useEffect(() => {
    CircularApi.getSingleCircular(cid)
      .then(res => {
        setCircular(res.data.circular[0])
        setTitle(res.data.circular[0].title)
        setdescri(res.data.circular[0].description)
        setClassSelected(JSON.parse(res.data.circular[0].st_class))
        setSelected(JSON.parse(res.data.circular[0].send_by))
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        setClassList(res.data.section_list)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const classListOption = classList?.map(cl => {
    return {
      value: cl.UID,
      label: `${cl.st_class} ${cl.st_sec}`,
    }
  })
  const SendListOption = [
    { value: 1, label: "Teacher" },
    { value: 2, label: "Student" },
    { value: 3, label: "Parent" },
  ]
  const handleTitleChange = event => {
    setTitle(event.target.value)
  }
  const handleDescriChange = event => {
    setdescri(event.target.value)
  }
  const classhandleChange = selectedOption => {
    setClassSelected(selectedOption)
  }
  const handleChange = selectedOption => {
    setSelected(selectedOption)
  }
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB in bytes
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: title,
      description: descri,
      st_class: classselected,
      send_by: selected,
      notice_file: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Title"),
      description: Yup.string().required("Please Enter Your Description"),
      st_class: Yup.array().min(1, "Please Enter Your Class"),
      send_by: Yup.array().min(1, "This is required"),
      notice_file: Yup.mixed()
        .test(
          "fileSize",
          "File size exceeds the limit of 5 MB.",
          value => !value || value.size <= MAX_FILE_SIZE
        )
        .notRequired(),
    }),
    onSubmit: values => {
      setloading(true)
      const data = new FormData()
      data.append("notice_file", files1)
      data.append("title", values.title)
      data.append("description", values.description)
      data.append("st_class", JSON.stringify(values.st_class))
      data.append("send_by", JSON.stringify(values.send_by))
      data.append("circular_id", id)
      data.append("session_id", session)
      CircularApi.updateCircular(data)
        .then(res => {
          if (res.data.status === 200) {
            setloading(false)
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/circular"
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
  })
  const formClear = () => {
    validation.resetForm()
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Circular" breadcrumbItem="Edit Circular" />
          <Row>
            <Col lg="12">
              <Card>
                { 
                loading ? (<Loading/>) :(  <CardBody>
                  {/* <CardTitle>Information</CardTitle> */}
                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      validation.handleSubmit()
                      return false
                    }}
                  >
                    <Row>
                      <Col sm={12} lg={6}>
                        <div className="mb-2">
                          <Label htmlFor="title" className="my-control">
                            Title
                          </Label>
                          <Input
                            id="n_title"
                            name="title"
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            onChange={handleTitleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.title}
                            invalid={
                              validation.touched.title &&
                              validation.errors.title
                                ? true
                                : false
                            }
                          />
                          {validation.touched.title &&
                          validation.errors.title ? (
                            <FormFeedback type="invalid">
                              {validation.errors.title}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="control-label my-control">
                            Class
                          </Label>
                          <Select
                            style={{ backgroundColor: "blue" }}
                            name="st_class"
                            className="basic-multi-select"
                            classNamePrefix="select2-selection"
                            placeholder="Select Class..."
                            title="Class"
                            options={classListOption}
                            isMulti
                            value={classselected}
                            // onClick={alert("tt")}
                            onChange={classhandleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.st_class &&
                              validation.errors.st_class
                                ? true
                                : false
                            }
                          />
                          {validation.touched.st_class &&
                          validation.errors.st_class ? (
                            <div
                              style={{
                                color: "#f46a6a",
                                fontSize: "11px",
                                marginTop: "3px",
                              }}
                            >
                              {/* {validation.errors.st_class} */}
                              This is required
                            </div>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label className="control-label my-control">
                          To send
                          </Label>
                          <Select
                            name="send_by"
                            classNamePrefix="select2-selection"
                            placeholder="Select..."
                            title="To send"
                            options={SendListOption}
                            isMulti
                            // onClick={alert("tt")}
                            value={selected}
                            onChange={handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.send_by &&
                              validation.errors.send_by
                                ? true
                                : false
                            }
                          />
                          {validation.touched.send_by &&
                          validation.errors.send_by ? (
                            <div
                              style={{
                                color: "#f46a6a",
                                fontSize: "11px",
                                marginTop: "3px",
                              }}
                            >
                              {/* {validation.errors.send_by} */}
                              This is required
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col sm={12} lg={6}>
                        
                        <div className="mb-3">
                          <Label htmlFor="Description" className="my-control">
                            Description
                          </Label>
                          <Input
                            id="n_title"
                            name="description"
                            rows="5"
                            type="textarea"
                            className="form-control"
                            placeholder="Write here your Description"
                            onChange={handleDescriChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.description}
                            invalid={
                              validation.touched.description &&
                              validation.errors.description
                                ? true
                                : false
                            }
                          />
                          {validation.touched.description &&
                          validation.errors.description ? (
                            <FormFeedback type="invalid">
                              {validation.errors.description}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mt-0">
                          <Label
                            className="control-label my-control"
                            htmlFor="input"
                          >
                            Upload Image or PDF
                          </Label>
                          <div className="input-group">
                            <Input
                              name="notice_file"
                              type="file"
                              className="form-control"
                              id="input"
                              // accept=".pdf"
                              onChange={e => {
                                setFiles1(e.target.files[0])
                                validation.setFieldValue(
                                  "notice_file",
                                  e.target.files[0]
                                )
                              }}
                              invalid={
                                validation.touched.notice_file &&
                                validation.errors.notice_file
                                  ? true
                                  : false
                              }
                            />
                          </div>
                          {validation.touched.notice_file &&
                          validation.errors.notice_file ? (
                            <div
                              style={{
                                color: "red",
                                fontSize: "11px",
                                marginTop: "3px",
                              }}
                            >
                              {validation.errors.notice_file}
                            </div>
                          ) : null}
                        </div>
                        {/* <div className="position-relative my-2">
                        {(circular?.notice_file  &&
                            circular?.notice_file ?.split(".").at(-1) == "jpg") ||
                          "jpeg" ||
                          "png" ? (
                            <img
                              src={`${config.BaseImageUrl}/${circular?.notice_file }`}
                              alt=""
                              width="200"
                            />
                          ) : (
                            <a
                              href={`${config.BaseImageUrl}/${circular?.notice_file }`}
                              rel="noopener noreferrer"
                              target="_blank"
                              className="text-muted"
                            >
                              <img
                                src={pdf}
                                alt=""
                                width="100"
                              />
                            </a>
                          )}
                          {circular?.notice_file &&
                          circular?.notice_file.split(".").at(-1) == "pdf" ? (
                            <iframe
                              src={`https://docs.google.com/viewer?url=${config.BaseImageUrl}/${circular?.notice_file} &embedded=true`}
                              // src={`http://${config.BaseImageUrl}/${circular?.notice_file}`}
                              height="200px"
                              width="300"
                            ></iframe>
                          ) : (
                            <></>
                          )}
                        </div> */}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="text-end pt-2">
                          <Button
                            color="primary"
                            type="submit"
                            className="btn btn-primary waves-effect waves-light"
                          >
                            Update
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>)
                
                }
              
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default EditCircular
