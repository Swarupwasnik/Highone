import React, { useEffect, useState,useContext } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Container, Row, Table } from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import SyllabusModel from "./SyllabusModel"
import { classApi } from "apis/ClassListApi"
import { SyllabusApi } from "apis/SyllabusAPI"
import config from "config/config"
import Swal from "sweetalert2"
import Loading from "components/Loading"
import { SessionContext } from "context/sessionContext"

const Syllabus = () => {
  document.title = "Syllabus "
  const myAdmin = JSON.parse(localStorage.getItem("Admin"))
  const myUser = JSON.parse(localStorage.getItem("User"))
  let user = myAdmin?.name
  const{Session}=useContext(SessionContext)
  let session= Session || sessionStorage.getItem("SessionId");
 
  const [classList, setClassList] = useState([])
  const [syllabusList, setSyllabusList] = useState([])
  const [loader, setLoader] = useState()
  const [f_class, setF_class] = useState("")
  let selectClassList = classList?.filter((list, index, arr) => {
    return index === arr.findIndex(d => d.label === list.label)
  })

  console.log(syllabusList)

  let data = {
    st_class: f_class || "",
    "session_id": session
  }

  useEffect(() => {
    if (syllabusList?.length === 0) {
      setLoader(<Loading />)
    }
    SyllabusApi.getSyllabus(data)
      .then(res => {
        if (res.data.status === 200) {
          setLoader("")
        }
        setSyllabusList(res.data.syllabus)
      })
      .catch(err => console.log(err.message))
  }, [f_class,session])

  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        if (user == "Admin") {
          setClassList(
            res.data?.section_list.map(cl => {
              return {
                value: cl.UID,
                label: `${cl.st_class}`,
              }
            })
          )
        } else {
          setClassList(
            myUser?.teacher_subject.map(cl => {
              return {
                value: cl.uid,
                label: `${cl.st_class}`,
              }
            })
          )
        }
      })
      .catch(err => console.log(err.message))
  }, [])

  const onDelete = id => {
    let sid = {
      syllabus_id: id,
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, delete it!",
    }).then(result => {
      if (result.isConfirmed) {
        SyllabusApi.deleteSyllabus(sid).then(res => {
          Swal.fire("Deleted!", res.data.msg, "success")
          window.location.href = "/syllabus"
        })
      }
    })
  }
  function convertDate(data) {
    const dateString = data
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    return formattedDate
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
       
          <Breadcrumbs title="Syllabus" breadcrumbItem="Syllabus List " />

          <Col xl="10" sm="12" className="mx-auto mb-4">
            <Row>
              <Col md={3} className="">
                <div className="mb-3">
                  <div className="col-sm-12">
                    <select
                      className="form-select"
                      type="select"
                      name="class"
                      onChange={e => setF_class(e.target.value)}
                    >
                      <option value="">Select Class</option>
                      {selectClassList?.map(class1 => (
                        <option key={class1.value} value={class1.label}>
                          {class1.label.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Col>
              <Col md={3} className=""></Col>
              <Col md={2}></Col>
              <Col md={4} className="">
                {user == "Admin" ? (
                  <SyllabusModel
                    classList={classList}
                    selectClassList={selectClassList}
                  />
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Col>
          <Col xl="10" sm="12" className="mx-auto mb-4">
            <Card>
              <CardBody>
                <Row>
                  {loader ? <div>{loader}</div> : null}

                  {syllabusList?.length === 0 ? (
                    <Card className="shadow-none">
                      <div
                        style={{ height: "310px" }}
                        className="align-center text-center"
                      >
                        <h2 className="text-primary mt-5 ">
                          Syllabus Not Found !
                        </h2>
                      </div>
                    </Card>
                  ) : ( !loader && 
                    <div className="table-responsive">
                      <Table className="table table-striped">
                        <thead>
                          <tr className="text-center">
                            <th className="text-center">Sr No</th>
                            <th>Class</th>
                            <th>Posted Date</th>
                            <th>File</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {syllabusList?.map((syll, index) => (
                            <tr key={index} className="text-center">
                              <th scope="row" className="text-center">
                                {index + 1}
                              </th>
                              <td>{`${syll.st_class}`.toUpperCase()}</td>

                              <td> {convertDate(syll.created_date)}</td>
                              <td>
                                <a
                                  href={`${config.BaseImageUrl}/${syll.syllabus}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-secondary"
                                >
                                  <i
                                    className="bx bx-download font-size-18"
                                    id="download"
                                  />
                                </a>
                              </td>
                              <td>
                                <div className="text-center">
                                  <Link
                                    to="#"
                                    className="text-danger text-center"
                                    onClick={() => {
                                      onDelete(syll.id)
                                    }}
                                  >
                                    <i
                                      className="mdi mdi-delete font-size-18"
                                      id="deletetooltip"
                                    />
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
              </CardBody>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Syllabus
