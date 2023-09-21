import { ProfilePic } from "apis/ProfilePic"
import React, { useEffect, useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import { Link } from "react-router-dom"
import Loading from "components/Loading"
import config from "config/config"
import Swal from "sweetalert2"

const ShowProfilePic = () => {
  const [students, setStudents] = useState([])
  const [loader, setLoader] = useState()
  const [modal_large, setmodal_large] = useState(false)
  const [commentId, setCommentId] = useState(false)

  function getStudentList() {
    ProfilePic.GetAllStudent()
      .then(res => {
        if (res.data.status === 200) {
          setStudents(res.data.student)
          setLoader()
        }
      })
      .catch(err => console.log(err.message))
  }

  useEffect(() => {
    if (students?.length === 0) {
      setLoader(<Loading />)
    }
    getStudentList()
  }, [])

  const verifyProfile = async body => {
    try {
      const res = await ProfilePic.VerifyStudent(body)
      console.log(res.data)
      getStudentList()
    } catch (err) {
      console.log(err.message)
    }
  }
  const approveStudent = id => {
    setLoader(<Loading />)
    const body = {
      st_code: id,
      status: "Approved",
    }
    verifyProfile(body).then(res => {
      Swal.fire({
        text: "Profile Approved",
        icon: "success",
        imageAlt: "success image",
      })
    })
  }
  const rejectStudent = id => {
    setLoader(<Loading />)
    const body = {
      st_code: id,
      status: "Rejected",
    }
    verifyProfile(body).then(res => {
      Swal.fire({
        text: "Profile Rejected",
        icon: "error",
        imageAlt: "error image",
      })
    })
  }

  const getCommentId = commentIdValue => {
    setCommentId(commentIdValue)
  }

  const imagetoggle = () => {
    if (modal_large) {
      setmodal_large(false)
    } else {
      setmodal_large(true)
    }
  }
  const handleImgClick = arg => {
    imagetoggle()
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs breadcrumbItem="Profile Pic" />
          <Col xl="10" sm="12" className="mx-auto mb-4">
            <Card>
              <CardBody>
                <Row>
                  {loader ? <div>{loader}</div> : null}

                  {students?.length === 0
                    ? !loader && (
                        <Card className="shadow-none">
                          <div
                            style={{ height: "310px" }}
                            className="align-center text-center"
                          >
                            <h2 className="text-primary mt-5 ">
                              Student Not Found !
                            </h2>
                          </div>
                        </Card>
                      )
                    : !loader && (
                        <div className="table-responsive">
                          <Table className="table table-striped">
                            <thead>
                              <tr className="text-center table-secondary">
                                <th className="text-center">Sr No</th>
                                <th>Profile Pic</th>
                                <th>Student Code</th>
                                <th className="text-start">Student Name</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {students
                                ?.filter(stu => stu.profile_image)
                                .map((student, index) => (
                                  <tr
                                    key={index}
                                    className="text-center align-middle"
                                  >
                                    <th scope="row" className="text-center">
                                      {/* {index + 1} */}
                                      {student.slno}
                                    </th>
                                    <td>
                                      {student.profile_image ? (
                                        // <a
                                        //   href={`${config.BaseImageUrl}/${student.profile_image}`}
                                        //   target="_blank"
                                        //   rel="noreferrer"
                                        // > </a>
                                        <img
                                          src={`${config.BaseImageUrl}/${student.profile_image}`}
                                          width={40}
                                          style={{
                                            borderRadius: 50,
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            handleImgClick()
                                            getCommentId(student.id)
                                          }}
                                        />
                                      ) : (
                                        <p className="text-danger font-size-14">
                                          No Profile
                                        </p>
                                      )}
                                    </td>

                                    <td className="text-center font-size-14">
                                      {student.st_code}
                                    </td>
                                    <td className="text-start font-size-14">
                                      {student.st_name}
                                    </td>
                                    <td>
                                      <div className="d-flex justify-content-center gap-3">
                                        <Link
                                          to="#"
                                          className="text-white bg-primary px-1 "
                                          onClick={() => {
                                            approveStudent(student.st_code)
                                          }}
                                        >
                                          <i className="mdi mdi-check font-size-18" />
                                        </Link>
                                        <Link
                                          to="#"
                                          className="text-white bg-danger px-1 "
                                          onClick={() => {
                                            rejectStudent(student.st_code)
                                          }}
                                        >
                                          <i className="mdi mdi-close font-size-18" />
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </div>
                      )}
                </Row>
                <Row>
                  <Modal isOpen={modal_large} toggle={imagetoggle} size="lg">
                    {students
                      ?.filter(item => item.id === commentId)
                      .map((student, index) => (
                        <ModalBody
                          key={index}
                          className="img_height d-flex justify-content-center align-items-center "
                        >
                          <div className="position-relative">
                            <img
                              src={`${config.BaseImageUrl}/${student.profile_image}`}
                              width={400}
                            />
                          </div>
                        </ModalBody>
                      ))}
                  </Modal>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default ShowProfilePic
