import PropTypes from "prop-types";
import React from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../store/actions";

// import images
import profile from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo.svg";
import profile1 from "assets/images/SPS Logo - Golden.png"

const ForgetPasswordPage = props => {

  //meta title
  document.title = "Forget Password | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      password: '',
      confirm_password: '',
     
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Please enter your password"),
      confirm_password: Yup
      .string()
      .required('Please retype your password.')
      .oneOf([Yup.ref('password')], 'Your password do not match.')
    }),
    onSubmit: (values) => {
      // console.log(values,'values')
      window.location.href = "/teacher_login"
      // dispatch(userForgetPassword(values, props.history));
    }
  });

  const { forgetError, forgetSuccessMsg } = useSelector(state => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
  }));

  return (
    <React.Fragment>
    <div className="account-pages pt-sm-5 bg-image">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5} style={{ marginTop: "100px" }}>
            <h2 className="text-center text-primary" >SOUTH POINT SCHOOL</h2>
            <Card className="overflow-hidden">
              <div className="bg-primary bg-soft">
                <Row>
                  <Col xs={7}>
                    <div className="text-primary p-4">
                      <h3 className="text-primary">Change Password</h3>
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
                    {/* {error ? <Alert color="danger">{error}</Alert> : null} */}

                   

                    <div className="mb-3">
                      <Label className="form-label">Password</Label>
                      <Input
                        name="password"
                        value={validation.values.password || ""}
                        type="password"
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
                      {validation.touched.password &&
                      validation.errors.password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.password}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Confirm Password </Label>
                      <Input
                        name="confirm_password"
                        className="form-control"
                        placeholder="Confirm Password"
                        type="password"
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
                      {validation.touched.confirm_password &&
                      validation.errors.confirm_password ? (
                        <FormFeedback type="invalid">
                          {validation.errors.confirm_password}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mt-3 d-grid">
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                      >
                        Reset
                      </button>
                    </div>
                    <hr className="mb-1" />
                  </Form>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  </React.Fragment>
    
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
