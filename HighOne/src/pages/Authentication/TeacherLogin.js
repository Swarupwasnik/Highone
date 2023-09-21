import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"

import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"

import { useSelector, useDispatch } from "react-redux"
import { Link, Navigate } from "react-router-dom"
import withRouter from "components/Common/withRouter"

import * as Yup from "yup"
import { useFormik } from "formik"
import { loginUser, socialLogin } from "../../store/actions"
import profile1 from "assets/images/SPS Logo - Golden.png"
import logo from "assets/images/logo.svg"
import { AuthAPI } from "../../apis/AuthAPI"
import Swal from "sweetalert2"
import Loading from "components/Loading"
const TeacherLogin = props => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  document.title = "TeacherLogin"

  useEffect(() => {
    if (localStorage.getItem("Token")) {
      window.location.href = "/dashboard"
    }
  }, [])

  const dispatch = useDispatch()

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      login_id: "",
      password: "",
    },
    validationSchema: Yup.object({
      login_id: Yup.string().required("Please Enter Employee code "),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: values => {
      loginUser(values)
      // dispatch(loginUser(values, props.router.navigate));
    },
  })

  const loginUser = async value => {
    setLoading(true)
    await AuthAPI.teacherLogin(value)
      .then(res => {
        if (res.data.status === 200) {
          localStorage.setItem("Token", JSON.stringify(res.data.token.access))
          localStorage.setItem("User", JSON.stringify(res.data))
          window.location.href = "/dashboard"
          setLoading(false)
        } else {
          Swal.fire({
            text: "Employee code or password may be incorrect, Please enter correct credentials",
            icon: "error",
            imageAlt: "error image",
            // confirmButtonColor: '#00CA84'
          })
          setLoading(false)
        }
      })
      .catch(function (error) {
        Swal.fire({
          text: "Employee code or password may be incorrect, Please enter correct credentials",
          icon: "error",
          imageAlt: "error image",
          // confirmButtonColor: '#00CA84'
        })
      })
  }

  const { error } = useSelector(state => ({
    error: state.Login.error,
  }))

  const signIn = (res, type) => {
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        login_id: res.profileObj.login_id,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      }
      dispatch(socialLogin(postData, props.router.navigate, type))
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        login_id: res.login_id,
        token: res.accessToken,
        idToken: res.tokenId,
      }
      dispatch(socialLogin(postData, props.router.navigate, type))
    }
  }

  return (
    <React.Fragment>
      {loading ? (
        <Loading />
      ) : (
        <div className="account-pages pt-sm-5 bg-image">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5} style={{ marginTop: "100px" }}>
                <h2
                  className="text-center text-danger"
                  style={{ fontWeight: "600" }}
                >
                  SOUTH POINT SCHOOL
                </h2>
                <Card className="overflow-hidden">
                  <div className="bg-primary bg-soft">
                    <Row>
                      <Col xs={7}>
                        <div className="text-primary p-4">
                          <h3
                            className="text-primary"
                            style={{ marginTop: "12px" }}
                          >
                            Teacher Login
                          </h3>
                          {/* <p>Sign in</p> */}
                        </div>
                      </Col>
                      <Col className="col-5 align-self-end">
                        <img
                          src={profile1}
                          alt=""
                          className="img-fluid"
                          style={{
                            height: "75px",
                            marginLeft: "91px",
                            marginTop: "8px",
                            marginBottom: "10px",
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div>
                      <Link to="/" className="logo-light-element">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img
                              src={logo}
                              alt=""
                              className="rounded-circle"
                              height="34"
                            />
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">
                      <Form
                        className="form-horizontal"
                        onSubmit={e => {
                          e.preventDefault()
                          validation.handleSubmit()
                          return false
                        }}
                      >
                        {error ? <Alert color="danger">{error}</Alert> : null}

                        <div className="mb-3">
                          <Label className="form-label">Employee code </Label>
                          <Input
                            name="login_id"
                            className="form-control"
                            placeholder="Enter Employee code "
                            type="login_id"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.login_id || ""}
                            invalid={
                              validation.touched.login_id &&
                              validation.errors.login_id
                                ? true
                                : false
                            }
                          />
                          {validation.touched.login_id &&
                          validation.errors.login_id ? (
                            <FormFeedback type="invalid">
                              {validation.errors.login_id}
                            </FormFeedback>
                          ) : null}
                        </div>

                        {/* <div className="mb-3"  className="input-group auth-pass-inputgroup"> */}

                        <Label className="form-label">Password</Label>
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

                        {/* <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div> */}

                        <div className="mt-3 d-grid">
                          <button
                            className="btn btn-primary btn-block"
                            type="submit"
                          >
                            Log In
                          </button>
                        </div>
                        <hr className="mb-1" />

                        {/* <div className="mt-4 text-center">
                        <h5 className="font-size-14 mb-3">Sign in with</h5>

                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <FacebookLogin
                              appId={facebook.APP_ID}
                              autoLoad={false}
                              callback={facebookResponse}
                              render={renderProps => (
                                <Link
                                  to="#"
                                  className="social-list-item bg-primary text-white border-primary"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-facebook" />
                                </Link>
                              )}
                            />
                          </li>
                          
                          <li className="list-inline-item">
                            <GoogleLogin
                              clientId={google.CLIENT_ID}
                              render={renderProps => (
                                <Link
                                  to="#"
                                  className="social-list-item bg-danger text-white border-danger"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-google" />
                                </Link>
                              )}
                              onSuccess={googleResponse}
                              onFailure={() => { }}
                            />
                          </li>
                        </ul>
                      </div> */}

                        {/* <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div> */}
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </React.Fragment>
  )
}

export default withRouter(TeacherLogin)

TeacherLogin.propTypes = {
  history: PropTypes.object,
}
