import React, { useEffect, useState } from "react"

import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  CardTitle,
  Label,
  Button,
  Form,
  Input,
  InputGroup,
  FormFeedback,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { AuthAPI } from "../../apis/AuthAPI"
// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import Swal from "sweetalert2"

const ChangePassword = props => {
  const [show, setShow] = useState(false)
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [user, setUserLogged] = useState(
    JSON.parse(localStorage.getItem("User"))
  )
  //meta title
  document.title = "Change Password"
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      password: "",
      n_password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Please enter your current password"),
      n_password: Yup.string().required("Please enter your password"),
      confirm_password: Yup.string()
        .required("Please retype your password.")
        .oneOf([Yup.ref("n_password")], "Your password does not match."),
    }),
    onSubmit: values => {
      console.log(values)
      let data = {
        t_code: user?.payload?.t_code,
        current_password: values.password,
        password: values.n_password,
      }
      changePassword(data)
      formClear()
    },
  })
  const changePassword = value => {
    AuthAPI.changePassword(value)
      .then(res => {
        console.log(res)
        if (res.data.status === 200) {
          if (res.data.msg === "Something went wrong.") {
            Swal.fire({
              text: res.data.msg,
              icon: "error",
              imageAlt: "error image",
            })
          } else {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "error image",
            })
          }
        } else if (res.data.status === 403) {
          Swal.fire({
            text: res.data.msg,
            icon: "error",
            imageAlt: "error image",
          })
        }
      })
      .catch(function (error) {
        Swal.fire({
          text: "Something went wrong",
          imageAlt: "error image",
        })
      })
  }
  const formClear = () => {
    validation.resetForm()
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Password" breadcrumbItem="Change password" />
          <Row>
            <Col xl={7}>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      validation.handleSubmit()

                      return false
                    }}
                  >
                    <Row className="mb-4">
                      <Label
                        htmlFor="horizontal-firstname-Input"
                        className="col-sm-3 col-form-label"
                      >
                        Current Password
                      </Label>
                      <Col sm={9}>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={show ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                            className="form-control"
                          />
                          <button
                            onClick={() => setShow(!show)}
                            className="btn btn-light "
                            type="button"
                            id="password-addon"
                          >
                            <i className="mdi mdi-eye-outline"></i>
                          </button>
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Label
                        htmlFor="horizontal-email-Input"
                        className="col-sm-3 col-form-label"
                      >
                        New Password
                      </Label>
                      <Col sm={9}>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="n_password"
                            className="form-control"
                            placeholder="New Password"
                            type={show1 ? "text" : "password"}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.n_password || ""}
                            invalid={
                              validation.touched.n_password &&
                              validation.errors.n_password
                                ? true
                                : false
                            }
                          />
                          <button
                            onClick={() => setShow1(!show1)}
                            className="btn btn-light "
                            type="button"
                            id="password1"
                          >
                            <i className="mdi mdi-eye-outline"></i>
                          </button>
                          {validation.touched.n_password &&
                          validation.errors.n_password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.n_password}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Label
                        htmlFor="horizontal-email-Input"
                        className="col-sm-3 col-form-label"
                      >
                        Confirm Password
                      </Label>
                      <Col sm={9}>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="confirm_password"
                            className="form-control"
                            placeholder="Confirm Password"
                            type={show2 ? "text" : "password"}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirm_password || ""}
                            invalid={
                              validation.touched.confirm_password &&
                              validation.errors.confirm_password
                                ? true
                                : false
                            }
                          />
                          <button
                            onClick={() => setShow2(!show2)}
                            className="btn btn-light "
                            type="button"
                            id="password2"
                          >
                            <i className="mdi mdi-eye-outline"></i>
                          </button>
                          {validation.touched.confirm_password &&
                          validation.errors.confirm_password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.confirm_password}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row className="justify-content-end">
                      <Col sm={9}>
                        <div>
                          <Button
                            type="submit"
                            color="primary"
                            className="w-md"
                          >
                            Reset
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* end row  */}
        </Container>
        {/* container-fluid */}
      </div>
    </React.Fragment>
  )
}

export default ChangePassword
