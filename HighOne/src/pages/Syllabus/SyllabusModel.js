import React, { useEffect, useState, useContext } from "react"
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
import { SessionContext } from "context/sessionContext"
import Swal from "sweetalert2"
import { SyllabusApi } from "apis/SyllabusAPI"

const Syllabusmodel = props => {
  const { classList, selectClassList } = props

  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")

  const MAX_FILE_SIZE = 5 * 1024 * 1024 

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      st_class: "",
      syllabus: "",
    },
    validationSchema: Yup.object({
      st_class: Yup.string().required("Please Enter Your Class"),
      syllabus: Yup.mixed()
        .test(
          "fileSize",
          "File size exceeds the limit of 5 MB.",
          value => !value || value.size <= MAX_FILE_SIZE
        )
        .required("Please upload a PDF file."),
    }),
    onSubmit: values => {
      const data = new FormData()
      data.append("st_class", values.st_class)
      data.append("session_id", session)
      data.append("syllabus", values.syllabus)

      SyllabusApi.createSyllabus(data)
        .then(res => {
          if (res.data.status === 200) {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/syllabus"
                toggle()
              }
            })
          }
          if (res.data.status === 403) {
            Swal.fire({
              text: res.data.msg,
              icon: 'info',
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                toggle()
              }
            })
          }
        })
        .catch(err => console.log(err.message))
    },
  })

  const [modal, setModal] = useState(false)

  const toggle = () => {
    if (modal) {
      formClear()
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
                Add Syllabus
              </Button>
            </CardBody>
          </Card>
          <div>
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle} tag="h4">
                Add Syllabus
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
                      <div className="mb-2">
                        <Label className="form-label my-control">Class</Label>
                        <select
                          name="st_class"
                          type="select"
                          className="form-select"
                          onChange={validation.handleChange}
                          onBlur={validation.onBlur}
                          value={validation.values.st_class}
                        >
                          <option value="">Select Class</option>
                          {selectClassList?.map(class1 => (
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
                              validation.setFieldValue(
                                "syllabus",
                                e.target.files[0]
                              )
                            }}
                            invalid={
                              validation.touched.syllabus &&
                              validation.errors.syllabus
                                ? true
                                : false
                            }
                          />
                        </div>
                        {validation.touched.syllabus &&
                        validation.errors.syllabus ? (
                          <div
                            style={{
                              color: "red",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            {validation.errors.syllabus}
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

export default withRouter(Syllabusmodel)
