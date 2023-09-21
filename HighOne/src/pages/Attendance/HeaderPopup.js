import React, { useContext, useState } from "react"
import {
  Container,
  Row,
  Card,
  CardBody,
  Col,
  FormGroup,
  InputGroup,
  CardTitle,
  Input,
  Table,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Spinner,
  Alert,
} from "reactstrap"
import ReactHTMLTableToExcel from "react-html-table-to-excel"
import { AttendanceContext } from "context/attendanceContext"
import img1 from "../../assets/image/pre.png"
import img2 from "../../assets/image/abs.png"
import img4 from "../../assets/image/tot.png"

const HeaderPopup = () => {
  const { studentList, convertDate, attendanceDate, st_class, st_sec } =
    useContext(AttendanceContext)

  const [modal, setModal] = useState(false)
  const [totalmodal, settotalModal] = useState(false)
  const [presentmodal, setpresentModal] = useState(false)
  const toggle = () => {
    if (modal) {
      setModal(false)
    } else {
      setModal(true)
    }
  }
  const Ttoggle = () => {
    if (totalmodal) {
      settotalModal(false)
    } else {
      settotalModal(true)
    }
  }
  const Ptoggle = () => {
    if (presentmodal) {
      setpresentModal(false)
    } else {
      setpresentModal(true)
    }
  }
  const handleProjectClick = arg => {
    toggle()
  }
  const handleTotalClick = arg => {
    Ttoggle()
  }
  const handlePresentClick = arg => {
    Ptoggle()
  }
  return (
    <>
      <Col lg={4}>
        <Card
          className="mini-stats-wid my-cursor"
          onClick={() => handleTotalClick()}
        >
          <CardBody>
            <div className="d-flex flex-wrap justify-content-center align-items-center ">
              <div className="me-3">
                <h5 className="text-white mb-2">Total</h5>
                <h3 className="mb-0">{studentList.total_student}</h3>
              </div>
              <div className="avatar-sm ms-auto">
                <div className="avatar-title bg-transparent rounded-circle text-primary font-size-20">
                  {/* <i className="bx bxs-book-bookmark"></i> */}
                  <img src={img4} alt="pre" width={59} />
                </div>
              </div>
            </div>
            <div>
              <Modal
                isOpen={totalmodal}
                toggle={Ttoggle}
                // style={{ width: "380px" }}
              >
                <ModalHeader toggle={Ttoggle} tag="h4">
                  {/* Total Student  */}
                  Total students on {convertDate(attendanceDate)}
                </ModalHeader>

                <ModalBody>
                  <Card className="shadow-none">
                    <CardBody>
                      <div className="table-responsive">
                        <Table className="table table-striped">
                          <thead>
                            <tr>
                              <th className="text-center">Sr No</th>
                              <th className="text-center">Student Code</th>
                              <th>Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentList?.student?.map((stu, index) => (
                              <tr key={index}>
                                <th scope="row" className="text-center">
                                  {index + 1}
                                </th>

                                <td className="text-center"> {stu.st_code}</td>
                                <td> {stu.st_name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </ModalBody>
              </Modal>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={4}>
        <Card
          className="blog-stats-wid my-cursor"
          onClick={() => handlePresentClick()}
        >
          <CardBody>
            <div className="d-flex flex-wrap justify-content-center align-items-center ">
              <div className="me-3 ">
                <h5 className="text-white mb-2">Present</h5>
                <h3 className="mb-0 ">{studentList.present}</h3>
              </div>
              <div className="avatar-sm ms-auto">
                <div className="avatar-title bg-transparent  rounded-circle text-primary font-size-20">
                  <img src={img1} alt="pre" width={59} />
                  {/* <i className="bx bxs-book-bookmark"></i> */}
                </div>
              </div>
            </div>
            <div>
              <Modal
                isOpen={presentmodal}
                toggle={Ptoggle}
                // style={{ width: "380px" }}
              >
                <ModalHeader toggle={Ptoggle} tag="h4">
                  Present students on {convertDate(attendanceDate)}
                </ModalHeader>
                <ModalBody>
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn-sm btn btn-success"
                    color="success"
                    table="table-to-xls"
                    filename="attendance"
                    sheet="tablexls"
                    buttonText="Print as XLS"
                  />

                  <Card className="shadow-none">
                    <CardBody>
                      <div className="table-responsive">
                        <Table
                          className="table table-striped"
                          id="table-to-xls"
                        >
                          <thead className="d-none">
                            <tr>
                              <th className="text-center">
                                List of Present Student
                              </th>
                              <th className="text-center">
                                {`${st_class.toUpperCase()} ${st_sec}`}
                              </th>
                              <th>{studentList?.attendence_date}</th>
                            </tr>
                          </thead>
                          <thead>
                            <tr>
                              <th className="text-center">Sr No</th>
                              <th className="text-center">Student Code</th>
                              <th>Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentList?.present_list?.map((stu, index) => (
                              <tr key={index}>
                                <th scope="row" className="text-center">
                                  {index + 1}
                                </th>
                                <td className="text-center"> {stu.st_code}</td>
                                <td> {stu.st_name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </ModalBody>
              </Modal>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg={4}>
        <Card
          className="blog-stats-wid my-cursor"
          onClick={() => handleProjectClick()}
        >
          <CardBody>
            <div className="d-flex flex-wrap justify-content-center align-items-center">
              <div className="me-3">
                <h5 className="text-white mb-2">Absent</h5>
                <h3 className="mb-0 ">{studentList.absent}</h3>
              </div>
              <div className="avatar-sm ms-auto">
                <div className="avatar-title bg-transparent rounded-circle text-primary font-size-20">
                  {/* <i className="bx bxs-book-bookmark"></i> */}
                  <img src={img2} alt="pre" width={59} />
                </div>
              </div>
            </div>
            <div>
              <Modal
                isOpen={modal}
                toggle={toggle}
                // style={{ width: "380px" }}
              >
                <ModalHeader toggle={toggle} tag="h4">
                  Absent students on {convertDate(attendanceDate)}
                </ModalHeader>
                <ModalBody>
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button btn-sm btn btn-success"
                    color="success"
                    table="table-to-xls"
                    filename="attendance"
                    sheet="tablexls"
                    buttonText="Print as XLS"
                  />
                  <Card className="shadow-none">
                    <CardBody>
                      <div className="table-responsive">
                        <Table
                          className="table table-striped"
                          id="table-to-xls"
                        >
                          <thead className="d-none">
                            <tr>
                              <th className="text-center">
                                List of Absent Student
                              </th>
                              <th className="text-center">
                                {`${st_class.toUpperCase()} ${st_sec}`}
                              </th>
                              <th>{studentList?.attendence_date}</th>
                            </tr>
                          </thead>
                          <thead>
                            <tr>
                              <th className="text-center">Sr No</th>
                              <th className="text-center">Student Code</th>
                              <th>Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentList?.absent_list?.map((stu, index) => (
                              <tr key={index}>
                                <th scope="row" className="text-center">
                                  {index + 1}
                                </th>
                                <td className="text-center"> {stu.st_code}</td>
                                <td> {stu.st_name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </ModalBody>
              </Modal>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

export default HeaderPopup
