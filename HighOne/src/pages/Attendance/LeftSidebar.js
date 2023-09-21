import React, { useContext, useState } from "react"
import moment from "moment"
import {
  Container,
  Row,
  Card,
  CardBody,
  Col,
  FormGroup,
  InputGroup,
  Table,
  Modal,
  ModalBody,
} from "reactstrap"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import { AttendanceContext } from "context/attendanceContext"
import ReactHTMLTableToExcel from "react-html-table-to-excel"
import { AttendanceApi } from "apis/AttendanceApi"
import { SessionContext } from "context/sessionContext"
import Loading from "components/Loading"
import Swal from "sweetalert2"

const LeftSidebar = () => {
  const { Session } = useContext(SessionContext)
  const sessionId = Session || window.sessionStorage.getItem("SessionId")
  const {
    classListOption,
    handleclassselect,
    selectedDate,
    handleDateChange,
    classSelect,
  } = useContext(AttendanceContext)

  const [presentmodal, setpresentModal] = useState(false)
  const Ptoggle = () => {
    if (presentmodal) {
      setpresentModal(false)
    } else {
      setpresentModal(true)
    }
  }

  const handlePresentClick = arg => {
    GenerateAttendanceReport()
  }
  const options = {
    maxDate: new Date(),
    // mode: 'range',
    // altInputClass: 'hide',
    dateFormat: "d M Y",
    minDate: new Date("01-01-2018"),
    inline: true,
    // altInput: true,
    // altFormat: "F j, Y",
    // dateFormat: "Y-m-d",
    // THIS `wrap` option is required when using external elements!
    // https://flatpickr.js.org/examples/#flatpickr-external-elements
    wrap: true,
  }
  const [loading, setLoading] = useState(false)
  const [AttendanceReport, setAttendanceReport] = useState([])
  const GenerateAttendanceReport = async () => {
    setLoading(true)
    const date = new Date(selectedDate)
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()

    try {
      if (classSelect.length === 1) {
        Swal.fire({
          text: "Please select class",
          icon: "info",
          imageAlt: "info image",
        }).then(result => {
          if (result.isConfirmed) {
            setLoading(false)
          }
        })
      } else {
        const body = {
          st_class: classSelect.substring(0, classSelect.lastIndexOf(" ")),
          st_sec: classSelect.substring(classSelect.lastIndexOf(" ") + 1),
          year: year,
          month: month,
          session_id: sessionId,
        }
        await AttendanceApi.generateAttendanceReport(body).then(res => {
          if (res.data.attendance_report.length === 0) {
            Swal.fire({
              text: "No Attendance Report Found !",
              icon: "warning",
              imageAlt: "warning image",
            }).then(result => {
              if (result.isConfirmed) {
                setLoading(false)
              }
            })
          } else {
            setAttendanceReport(res.data.attendance_report)
            setLoading(false)
            Ptoggle()
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const String = str => {
    let num = str
    num = str.toString()
    return num
  }

  const fileName = () => {
    const date = new Date(selectedDate)
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    let name =
      "Attendance Report" + " " + classSelect + " " + month + ", " + year

    return name
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Card>
            <CardBody className="p-3">
              <Row className="mb-0">
                <div className="col-sm-12">
                <h4 className="card-title mb-2  text-start">Select Class</h4>
                  <select
                    value={classSelect}
                    className="form-select"
                    type="select"
                    name="class"
                    onChange={handleclassselect}
                  >
                    <option value="" style={{ fontWeight: "bold" }}>
                      Select Class
                    </option>
                    {classListOption?.map((class1, index) => (
                      <option key={index} value={class1.label}>
                        {class1.label.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </Row>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-3">
              <div className="form-group mb-0">
                <h4 className="card-title mb-2  text-start">Select Date</h4>
                <Flatpickr
                  className="form-control d-block"
                  placeholder="dd M,yyyy"
                  value={selectedDate}
                  onChange={handleDateChange}
                  options={{
                    inline: true,
                    dateFormat: "d M Y",
                    maxDate: new Date(),
                    // altInput: true,
                    // altFormat: "F j, Y",
                    // dateFormat: "Y-m-d",
                  }}
                />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-4">
              <div className="text-center">
                <Row className="">
                  <Col xl={12}>
                    {/* <h4 className="card-title mb-3 me-2 text-start">
                  Generate Attendance Report
                </h4> */}
                    {/* 
                <FormGroup className="mb-4">
                  <InputGroup>
                    <Flatpickr
                      className="form-control"
                      placeholder="2023-04-01 to 2023-04-25"
                      options={{
                        mode: "range",
                        dateFormat: "Y-m-d",
                      }}
                    />
                  </InputGroup>
                </FormGroup> */}

                    <button
                      onClick={() => handlePresentClick()}
                      type="button"
                      className="btn bg-primary text-white btn-rounded text-center"
                    >
                      GENERATE {fileName().toUpperCase()}
                    </button>

                    <Modal
                      isOpen={presentmodal}
                      toggle={Ptoggle}
                      // style={{ width: "380px" }}
                      size="xl"
                    >
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button btn-lg btn btn-success"
                        color="success"
                        table="table-to-xls"
                        filename={fileName()}
                        sheet="tablexls"
                        buttonText="Print as XLS"
                      />
                      <ModalBody>
                        <Card className="shadow-none">
                          <CardBody>
                            <div className="table-responsive">
                              <Table
                                className="table table-striped"
                                id="table-to-xls"
                              >
                                <thead>
                                  <tr>
                                    <th className="text-center">Sr.</th>
                                    <th className="text-center">Roll No</th>
                                    <th className="text-center">Name</th>
                                    <th className="text-center">1</th>
                                    <th className="text-center">2</th>
                                    <th className="text-center">3</th>
                                    <th className="text-center">4</th>
                                    <th className="text-center">5</th>
                                    <th className="text-center">6</th>
                                    <th className="text-center">7</th>
                                    <th className="text-center">8</th>
                                    <th className="text-center">9</th>
                                    <th className="text-center">10</th>
                                    <th className="text-center">11</th>
                                    <th className="text-center">12</th>
                                    <th className="text-center">13</th>
                                    <th className="text-center">14</th>
                                    <th className="text-center">15</th>
                                    <th className="text-center">16</th>
                                    <th className="text-center">17</th>
                                    <th className="text-center">18</th>
                                    <th className="text-center">19</th>
                                    <th className="text-center">20</th>
                                    <th className="text-center">21</th>
                                    <th className="text-center">22</th>
                                    <th className="text-center">23</th>
                                    <th className="text-center">24</th>
                                    <th className="text-center">25</th>
                                    <th className="text-center">26</th>
                                    <th className="text-center">27</th>
                                    <th className="text-center">28</th>
                                    <th className="text-center">29</th>
                                    <th className="text-center">30</th>
                                    <th className="text-center">31</th>
                                    <th className="text-center">Present</th>
                                    <th className="text-center">Absent</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {AttendanceReport?.map((stu, index) => {
                                    const value = stu[index + 1]
                                    return (
                                      <tr key={index}>
                                        <th scope="row" className="text-center">
                                          {index + 1}
                                        </th>
                                        <td className="text-center">
                                          {stu.serial_no}
                                        </td>
                                        <td className="text-center">
                                          {stu.st_name}
                                        </td>
                                        <td className="text-center">
                                          {stu[1]}
                                        </td>
                                        <td className="text-center">
                                          {stu[2]}
                                        </td>
                                        <td className="text-center">
                                          {stu[3]}
                                        </td>
                                        <td className="text-center">
                                          {stu[4]}
                                        </td>
                                        <td className="text-center">
                                          {stu[5]}
                                        </td>
                                        <td className="text-center">
                                          {stu[6]}
                                        </td>
                                        <td className="text-center">
                                          {stu[7]}
                                        </td>
                                        <td className="text-center">
                                          {stu[8]}
                                        </td>
                                        <td className="text-center">
                                          {stu[9]}
                                        </td>
                                        <td className="text-center">
                                          {stu[10]}
                                        </td>
                                        <td className="text-center">
                                          {stu[11]}
                                        </td>
                                        <td className="text-center">
                                          {stu[12]}
                                        </td>
                                        <td className="text-center">
                                          {stu[13]}
                                        </td>
                                        <td className="text-center">
                                          {stu[14]}
                                        </td>
                                        <td className="text-center">
                                          {stu[15]}
                                        </td>
                                        <td className="text-center">
                                          {stu[16]}
                                        </td>
                                        <td className="text-center">
                                          {stu[17]}
                                        </td>
                                        <td className="text-center">
                                          {stu[18]}
                                        </td>
                                        <td className="text-center">
                                          {stu[19]}
                                        </td>
                                        <td className="text-center">
                                          {stu[20]}
                                        </td>
                                        <td className="text-center">
                                          {stu[21]}
                                        </td>
                                        <td className="text-center">
                                          {stu[22]}
                                        </td>
                                        <td className="text-center">
                                          {stu[23]}
                                        </td>
                                        <td className="text-center">
                                          {stu[24]}
                                        </td>
                                        <td className="text-center">
                                          {stu[25]}
                                        </td>
                                        <td className="text-center">
                                          {stu[26]}
                                        </td>
                                        <td className="text-center">
                                          {stu[27]}
                                        </td>
                                        <td className="text-center">
                                          {stu[28]}
                                        </td>
                                        <td className="text-center">
                                          {stu[29]}
                                        </td>
                                        <td className="text-center">
                                          {stu[30]}
                                        </td>
                                        <td className="text-center">
                                          {stu[31]}
                                        </td>
                                        <td className="text-center">
                                          {stu.presnt}
                                        </td>
                                        <td className="text-center">
                                          {stu.absent}
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </Table>
                            </div>
                          </CardBody>
                        </Card>
                      </ModalBody>
                    </Modal>
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </>
  )
}

export default LeftSidebar
