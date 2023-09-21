import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { classApi } from "apis/ClassListApi"
import { Col, Row, FormGroup } from "reactstrap"
import Attendance from '../../pages/Attendance'

const ClassDropdown = () => {
  const name = JSON.parse(localStorage.getItem("User"))
  const [classList, setClassList] = useState([])
  const [classListOption, setClassListOption] = useState([])
  const [classSelect, setClassSelect] = useState(null)
  // console.log(classSelect)

  useEffect(()=>{
    localStorage.setItem('classselect',JSON.stringify(classSelect))
  },[classSelect])
  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        setClassList(res.data)
        if (name == "Admin") {
          setClassListOption(
            res?.data?.section_list?.map(cl => {
              return {
                value: cl.UID,
                label: `${cl.st_class} ${cl.st_sec}`,
              }
            })
          )
        }
      })
      .catch(err => {
        console.log(err)
      })
    if (name != "Admin") {
      setClassListOption(
        name?.teacher_subject?.map(cl => {
          return {
            value: cl.UID,
            label: `${cl.st_class} ${cl.st_sec}`,
          }
        })
      )
    }
  }, [])

  return (
    <React.Fragment>
      <FormGroup className="mt-3" row>
        <Col md={12} className="pr-0">
          <Row className="mb-0">
            <div className="col-md-12">
              <select
                className="form-select"
                defaultValue='0'
                onChange={e => setClassSelect(e.target.value)}
              >
                {/* <option>Select</option> */}
                {classListOption &&
                  classListOption?.map((sub, index) => (
                    <option key={index} value={sub.label}>
                      {sub.label}
                    </option>
                  ))}
              </select>
            </div>
          </Row>
        </Col>
      </FormGroup>
      {/* <Attendance/> */}
    </React.Fragment>
  )
}
export default ClassDropdown
