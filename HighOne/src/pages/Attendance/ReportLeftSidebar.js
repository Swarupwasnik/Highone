import React, { useContext } from "react"
import moment from "moment"
import {
  Container,
  Row,
  Card,
  CardBody,
  Col,
  FormGroup,
  InputGroup,
} from "reactstrap"
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"
import { AttendanceContext } from "context/attendanceContext"
import { useNavigate } from "react-router-dom"
const ReportLeftSidebar = () => {
  const {
    classListOption,
    handleclassselect,
    selectedDate,
    handleDateChange,
    classSelect,
  } = useContext(AttendanceContext)
  

  const navigate=useNavigate()
  const options = {
    maxDate: new Date(),
    // mode: 'range',
    // altInputClass: 'hide',
    dateFormat: 'd M Y',
    minDate: new Date('01-01-2018'),
    inline: true,
    // altInput: true,
    // altFormat: "F j, Y",
    // dateFormat: "Y-m-d",
    // THIS `wrap` option is required when using external elements!
    // https://flatpickr.js.org/examples/#flatpickr-external-elements
    wrap: true,
  }


  return (
    <>
      <Card>
        <CardBody className="p-3">
          <Row className="mb-0">
            <div className="col-sm-12">
              <select
                value={classSelect}
                className="form-select"
                type="select"
                name="class"
                // onChange={handleclassselect}
                onClick={()=>navigate("/attendance")}
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
                dateFormat: 'd M Y',
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
                <h4 className="card-title mb-3 me-2 text-start">
                  Generate Attendance Report
                </h4>
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
                </FormGroup>
                <button
                  type="button"
                  className="btn bg-primary text-white btn-rounded text-center"
                >
                  Generate
                </button>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default ReportLeftSidebar
