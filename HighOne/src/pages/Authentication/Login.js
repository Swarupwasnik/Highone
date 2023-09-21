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
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import Swal from "sweetalert2"
import * as Yup from "yup"
import { useFormik } from "formik"
import profile1 from "assets/images/SPS Logo - Golden.png"
import logo from "assets/images/logo.svg"
import { AuthAPI } from "../../apis/AuthAPI"
import Loading from "components/Loading"

const Login = props => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("Token")) {
      window.location.href = "/dashboard"
    }
  }, [])

  document.title = "Login | School"
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      login_id: "",
      password: "",
    },
    validationSchema: Yup.object({
      login_id: Yup.string().required("Please Enter Your login Id"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: values => {
      loginUser(values)
    },
  })

  const loginUser = value => {
    setLoading(true)
    AuthAPI.login(value)
      .then(res => {
        console.log(res.data.status, "res")
        if (res.data.status === 200) {
          localStorage.setItem("User", JSON.stringify("Admin"))
          localStorage.setItem(
            "Token",
            JSON.stringify(res.data.payload.token.access)
          )
          localStorage.setItem("Admin", JSON.stringify(res.data.payload))
          window.location.href = "/dashboard"
          setLoading(false)
        } else {
          Swal.fire({
            text: "Login Id or password may be incorrect, Please enter correct credentials",
            icon: "error",
            imageAlt: "error image",
            // confirmButtonColor: '#00CA84'
          })
          setLoading(false)
        }
      })
      .catch(function (error) {
        Swal.fire({
          text: error,
          icon: "error",
          imageAlt: "error image",
          // confirmButtonColor: '#00CA84'
        })
      })
  }

  const { error } = useSelector(state => ({
    error: state.Login.error,
  }))

  return (
    <React.Fragment>
      {loading ? (
        <Loading />
      ) : (
        <div className="account-pages  pt-sm-5 bg-image">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5} style={{ marginTop: "100px" }}>
                <h1
                  className="text-center text-danger"
                  style={{ fontWeight: "600" }}
                >
                  SOUTH POINT SCHOOL
                </h1>
                <Card className="overflow-hidden">
                  <div className="bg-primary bg-soft">
                    <Row>
                      <Col xs={7}>
                        <div className="text-primary p-4">
                          <h3
                            className="text-primary"
                            style={{ marginTop: "12px" }}
                          >
                            Admin Login{" "}
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
                          <Label className="form-label">Login Id</Label>
                          <Input
                            name="login_id"
                            className="form-control"
                            placeholder="Enter Login Id"
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

                        {/* <div className="mb-3"> */}
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
                        {/* <div className="mt-4 text-start">
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

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}
