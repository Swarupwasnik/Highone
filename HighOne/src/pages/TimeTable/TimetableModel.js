import React, { useEffect, useState, useContext } from "react"
import withRouter from "components/Common/withRouter"
import {
  Col,
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
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import { SessionContext } from "context/sessionContext"
import Swal from "sweetalert2"
import { TimetableApi } from "apis/TimeTableApi"

const TimetableModel = props => {
  const { selectClassList } = props

  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")
  const [f_class, setF_class] = useState("")

  const str = f_class
  const parts = str.split(" ")
  let sel_class = parts[0]
  let sel_section = parts[1]

  const MAX_FILE_SIZE = 5 * 1024 * 1024

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      st_class: sel_class + " " + sel_section,
      timetable: "",
      st_sec: sel_section,
    },
    validationSchema: Yup.object({
      st_class: Yup.string().required("Please Enter Your Class"),
      timetable: Yup.mixed()
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
      data.append("timetable", values.timetable)
      data.append("session_id", session)

      TimetableApi.createTimetable(data)
        .then(res => {
          if (res.data.status === 200) {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/timetable"
                toggle()
              }
            })
          }
          if (res.data.status === 403) {
            Swal.fire({
              text: res.data.msg,
              icon: "info",
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
      setF_class("")
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
                Add Timetable
              </Button>
            </CardBody>
          </Card>
          <div>
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle} tag="h4">
                Add Timetable
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
                          onChange={e => setF_class(e.target.value)}
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
                            name="timetable"
                            type="file"
                            className="form-control"
                            id="inputGroupFile02"
                            accept=".pdf"
                            onChange={e => {
                              validation.setFieldValue(
                                "timetable",
                                e.target.files[0]
                              )
                            }}
                            invalid={
                              validation.touched.timetable &&
                              validation.errors.timetable
                                ? true
                                : false
                            }
                          />
                        </div>
                        {validation.touched.timetable &&
                        validation.errors.timetable ? (
                          <div
                            style={{
                              color: "red",
                              fontSize: "11px",
                              marginTop: "3px",
                            }}
                          >
                            {validation.errors.timetable}
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

export default withRouter(TimetableModel)
