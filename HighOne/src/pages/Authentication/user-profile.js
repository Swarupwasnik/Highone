import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  CardTitle,
  Table,
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"
import Loading from "components/Loading"

//redux
import { useSelector, useDispatch } from "react-redux"
import withRouter from "components/Common/withRouter"
import profile1 from "assets/images/profile-img.png"
import Breadcrumb from "../../components/Common/Breadcrumb"

import avatar from "../../assets/images/users/default_image.jpg"
// actions
import { GetAllTeacher } from "apis/ChatsApi"

const UserProfile = () => {
  //meta title
  document.title = "Profile"
  const myValue = JSON.parse(localStorage.getItem("User"))
  let teacher_code = myValue?.payload?.t_code ? myValue?.payload?.t_code : ""
  const [user, setuser] = useState([])
  const [loader, setLoader] = useState()

  let data = {
    t_code: teacher_code,
  }

  useEffect(() => {
    if (user?.length === 0) {
      setLoader(<Loading />)
    }
    GetAllTeacher.GetSingleUser(data)
      .then(res => {
        if (res.data.status === 200) {
          setLoader("")
        }
        setuser(res.data.data[0])
      })
      .catch(err => console.log(err.message))
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="" breadcrumbItem="Profile" />
          <Row>
            <Col xl="8">
              <Card className="overflow-hidden">
                <div className="bg-primary bg-gradient p-4 shadow">
                  <Row>
                    <CardBody></CardBody>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  {loader ? (
                    <div>{loader}</div>
                  ) : (
                    <>
                      <Row>
                        <Col sm="8">
                          <div className="avatar-lg profile-user-wid mb-4">
                            {user.profile_pic_url ? (
                              <img
                                src={user.profile_pic_url}
                                alt="user"
                                className="img-thumbnail"
                              />
                            ) : (
                              <img
                                src={avatar}
                                alt="user"
                                className="img-thumbnail"
                              />
                            )}
                          </div>
                          <h5 className="font-size-15 text-truncate">
                            {user.t_name}
                          </h5>
                          <p className="text-muted mb-0 text-truncate">
                            {user.is_class_teacher === 1
                              ? "Class Teacher"
                              : "Teacher"}
                          </p>
                          <small>{`${user?.home_class?.toUpperCase()} ${
                            user.home_sec
                          }`}</small>
                        </Col>
                      </Row>
                      <CardTitle className="mb-3 mt-5">
                        Personal Information
                      </CardTitle>
                      <div className="table-responsive">
                        <Table className="table-nowrap mb-0">
                          <tbody>
                            <tr>
                              <th scope="row">Full Name :</th>
                              <td>{user.t_name}</td>
                            </tr>
                            <tr>
                              <th scope="row">Code :</th>
                              <td>{`${user.t_code}`}</td>
                            </tr>
                            <tr>
                              <th scope="row">Mobile :</th>
                              <td>
                                {user.t_cellphone ? user.t_cellphone : "NA"}
                              </td>
                            </tr>
                            <tr>
                              <th scope="row">Email :</th>
                              <td>{user.t_email ? user.t_email : "NA"}</td>
                            </tr>
                            <tr>
                              <th scope="row">Address:</th>
                              <td>{ user.address1 || user.city || user.state || user.pin ? `${user.address1} ${user.address2} ${user.city}, ${user.state} - ${user.pin}`  : "NA"}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default UserProfile
