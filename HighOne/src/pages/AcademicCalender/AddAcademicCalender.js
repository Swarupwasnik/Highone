import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import * as Yup from "yup"
import { useFormik } from "formik"
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  NavItem,
  UncontrolledTooltip,
} from "reactstrap"

import Breadcrumbs from "../../components/Common/Breadcrumb2"
import Swal from "sweetalert2"
import { AcademicCalenderApi } from "apis/AcademicCalenderApi"
import config from "config/config"
import { SessionContext } from "context/sessionContext"

const AddAcademicCalender = () => {
  document.title = "Academic Calendar"
  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")
  const [files1, setFiles1] = useState([])
  const [academicCalender, setAcademicCalender] = useState([])

  const [user, setUserLogged] = useState(
    JSON.parse(localStorage.getItem("User"))
  )

  useEffect(() => {
    const data = {
      session_id: session,
    }

    AcademicCalenderApi.GetAcademicCalender(data)
      .then(res => {
        setAcademicCalender(res.data.academic_calender[0])
      })
      .catch(err => {
        console.log(err)
      })
  }, [session])
  //  form validation
  const validationType = useFormik({
    enableReinitialize: true,
    initialValues: {
      academic_calender: files1,
      session_id: session,
    },
    validationSchema: Yup.object().shape({
      academic_calender: Yup.string().required("This is required"),
    }),

    onSubmit: values => {
      const data = new FormData()
      data.append("academic_calender", files1)
      data.append("session_id", session)
      AcademicCalenderApi.createAcademicCalender(data)
        .then(res => {
          if (res.data.status === 200) {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/academic-calender"
              }
            })
          }
        })
        .catch(err => console.log(err))
    },
  })

  const onDelete = id => {
    let sid = {
      id: id,
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        AcademicCalenderApi.deleteAcademicCalender(sid).then(res => {
          Swal.fire("Deleted!", res.data.msg, "success")
          window.location.href = "/academic-calender"
        })
      }
    })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs />
          {/* <Breadcrumbs
            title="Academic Calender"
            breadcrumbItem="Add Academic Calender"
          /> */}

          <Col sm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col xs={6}>
                    <CardTitle className="text-uppercase">
                      Academic Calendar
                    </CardTitle>
                  </Col>
                  <Col xs={6}>
                    <Link to="#" className="badge  font-size-18 text-danger">
                      <i
                        className="mdi mdi-delete font-size-18"
                        id="deletetooltip"
                        onClick={() => onDelete(academicCalender?.id)}
                      />
                      <UncontrolledTooltip
                        placement="top"
                        target="deletetooltip"
                      >
                        Delete
                      </UncontrolledTooltip>
                    </Link>
                  </Col>
                </Row>

                <Form
                  onSubmit={e => {
                    e.preventDefault()
                    validationType.handleSubmit()
                  }}
                >
                  <Row>
                    <Col sm="7">
                      <div className="mb-3 mt-3">
                        <Label htmlFor="validationCustom01">
                          Upload Academic Calender PDF
                        </Label>
                        <Input
                          name="academic_calender"
                          placeholder="Enter Academic Calender Url"
                          type="file"
                          className="form-control"
                          accept=".pdf"
                          onChange={e => {
                            setFiles1(e.target.files[0])
                            validationType.setFieldValue(
                              "academic_calender",
                              e.target.files[0]
                            )
                          }}
                          invalid={
                            validationType.touched.academic_calender &&
                            validationType.errors.academic_calender
                              ? true
                              : false
                          }
                        />
                        {validationType.touched.academic_calender &&
                        validationType.errors.academic_calender ? (
                          <FormFeedback type="invalid">
                            This is required
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="position-relative my-2">
                        {academicCalender?.id ? (
                          <iframe
                            src={`https://docs.google.com/viewer?url=${config.BaseImageUrl}/${academicCalender?.academic_calender} &embedded=true`}
                            height="500px"
                            width="100%"
                          ></iframe>
                        ) : (
                          <div
                            style={{ height: "310px" }}
                            className="align-center text-center"
                          >
                            <h3 className="text-primary mt-5 ">
                              Academic Calendar Not Available !
                            </h3>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <div className="d-flex flex-wrap gap-3">
                    <Button type="submit" color="primary" className="btn ">
                      SUBMIT
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AddAcademicCalender
