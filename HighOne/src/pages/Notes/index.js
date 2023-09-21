import React, { useEffect, useState,useContext } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import Select from "react-select"
import Pagination from "react-js-pagination"
import {
  Col,
  Container,
  Row,
  Label,
  Table,
  Card,
  CardBody,
  Spinner,
  Form,
  Input,
  Button,
} from "reactstrap"
import { map } from "lodash"
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
//Import Card
import NotesCard from "./Notes.js"
import Notesmodel from "./Notesmodel.js"
import { classApi } from "apis/ClassListApi.js"
import { NotesApi } from "apis/NotesApi.js"
import Swal from "sweetalert2"
import config from "config/config"
import Loading from "components/Loading.js"
import { SessionContext } from "context/sessionContext"

const Notes = () => {
  //meta title
  document.title = "Notes"
  
  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")

  const [CurrentPage, setCurrentPage] = useState(1)
  const [Page, setPage] = useState(1)
  const resultPerPage = 20
  const [isLoading, setIsLoading] = useState(true)
  const [classList, setClassList] = useState([])
  // const [subjectListoption, setSubjectListoption] = useState([])
  const [notesList, setNotesList] = useState([])
  const [subject, setSubject] = useState("")
  const [f_class, setF_class] = useState("")
  const [chapter, setChapter] = useState({
    ch: "",
    le: "",
  })
  const [search, setSearch] = useState({
    ch: "",
    le: "",
  })
  const keys = ["chapter", "lession"]
  // for subject option
  const [teachersubject, setTeacherSubject] = useState([])
  // to model
  const [classListOption, setClassListOption] = useState([])
  // for class option
  const [classSectionListOption, setClassSectionListOption] = useState([])
  let filterClassSectionList = classSectionListOption?.filter(
    (list, index, arr) => {
      return index === arr.findIndex(d => d.label === list.label)
    }
  )
  const myValue = JSON.parse(localStorage.getItem("User"))
  let teacher_code = myValue?.payload?.t_code ? myValue?.payload?.t_code : ""
  let t_name = myValue?.payload?.t_name ? myValue?.payload?.t_name : ""
  let teacher_profile = myValue?.payload?.profile_pic_url
    ? myValue?.payload?.profile_pic_url
    : ""
  const str = f_class
  const parts = str.split(" ")
  let sel_class = parts[0]
  let sel_section = parts[1]

  useEffect(() => {
    let data = {
      t_code: teacher_code,
      st_class: sel_class || "",
      st_sec: sel_section || "",
     
    }
    classApi
      .getTeacherSubject(data)
      .then(res => {
        setTeacherSubject(res.data.subject)
      })
      .catch(err => {
        console.log(err)
      })
  }, [sel_class, sel_section])

  useEffect(() => {
    let notesAuth = {
      teacher_code: teacher_code,
      class: f_class || "",
      subject: subject || "",
      resultPerPage: CurrentPage,
      session_id: session
    }
    NotesApi.GetNotes(notesAuth)
      .then(res => {
        setNotesList(res.data)
        setPage(res.data.notes_count)
        setSubject("")
        setIsLoading(false)
        localStorage.setItem("mynotes", JSON.stringify(res.data))
      })
      .catch(err => {
        const savedData = JSON.parse(localStorage.getItem("mynotes"))
        setNotesList(savedData)
        setIsLoading(false)
        console.log(err)
      })
  }, [f_class, subject, CurrentPage,session])

  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        setClassList(res.data)
      })
      .catch(err => {
        console.log(err)
      })

    if (myValue != "Admin") {
      setClassListOption(
        myValue?.teacher_subject?.map(cl => {
          return {
            value: cl.uid,
            label: `${cl.st_class}`,
          }
        })
      )
    }
    if (myValue != "Admin") {
      setClassSectionListOption(
        myValue?.teacher_subject?.map(cl => {
          return {
            value: cl.uid,
            label: `${cl.st_class} ${cl.st_sec}`,
          }
        })
      )
    }
  }, [])

  const onNotesDelete = id => {
    const NotesId = {
      notes_id: id,
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
        NotesApi.deleteNotes(NotesId).then(res => {
          Swal.fire("Deleted!", res.data.msg, "success")
          window.location.href = "/notes"
        })
      }
    })
  }
  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setChapter(values => ({ ...values, [name]: value }))
  }
  const handleSubmit = event => {
    event.preventDefault()
    setSearch({
      ch: chapter.ch,
      le: chapter.le,
    })
    setChapter({ ch: "", le: "" })
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
    <div className="page-content">
      <Container fluid>
        {/* Render Breadcrumb */}
        <Breadcrumbs title="" breadcrumbItem="Notes" />

        <Col xl="11" sm="12" className="mx-auto mb-4">
          <Row>
          <Col md={3}></Col>
          <Col md={3}></Col>
          <Col md={3}></Col>
          <Col md={3} className="">
              <Notesmodel
                classListOption={classListOption}
                teacher_code={teacher_code}
                t_name={t_name}
                teacher_profile={teacher_profile}
              />
            </Col>
          </Row>
          <Row>
            <Col md={2} className="">
              <div className="mb-3">
                {/* <label className="col-md-2 col-form-label text-center font-size-14">
                    Class
                  </label> */}
                <div className="col-sm-12">
                  <select
                    className="form-select"
                    type="select"
                    name="class"
                    onChange={e => setF_class(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {filterClassSectionList?.map(class1 => (
                      <option key={class1.value} value={class1.label}>
                        {class1.label.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Col>
            <Col md={3} className="">
              <div className="mb-3">
                {/* <label className="col-md-3 col-form-label text-center font-size-14">
                    Subject
                  </label> */}
                <div className="col-sm-12">
                  <select
                    name="subject"
                    onChange={e => setSubject(e.target.value)}
                    type="select"
                    className="form-select"
                  >
                    <option value="">Select Subject</option>
                    {teachersubject?.map((sub, index) => (
                      <option key={index} value={sub.subject_name}>
                        {sub.subject_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Col>
            <Col md={7}>
              <Form onSubmit={handleSubmit} className="d-flex gap-3">
                <Col sm={5} className="">
                  <div className="col-sm-12">
                    <Input
                      name="ch"
                      type="text"
                      className="form-control"
                      placeholder="Chapter Name"
                      value={chapter.ch || ""}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
                <Col sm={5} className="">
                  <div className="col-sm-12">
                    <Input
                      name="le"
                      type="text"
                      className="form-control"
                      placeholder="Lesson Name"
                      value={chapter.le || ""}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
                <Col md={2}>
                  <Button
                    type="submit"
                    color="primary"
                    className="btn btn-primary waves-effect waves-light"
                  >
                    {/* <i className="bx bxs-add-to-queue p-1"></i> */}
                    Search
                  </Button>
                </Col>
              </Form>
            </Col>
           
          </Row>
        </Col>
        <Col xl="11" sm="12" className="mx-auto mb-4">
          <Row>
            {isLoading ? (
              <Card>
                <Loading />
                {/* <div
                  style={{ height: "310px", zIndex: 999 }}
                  className=" align-center text-center"
                >
                  <Spinner
                    color="primary"
                    style={{
                      marginTop: "6rem",
                      height: "3rem",
                      width: "3rem",
                      textAlign: "center",
                    }}
                  >
                    Loading...
                  </Spinner>{" "}
                </div>{" "} */}
              </Card>
            ) : (
              ""
            )}

            {notesList?.notes?.length === 0 ? (
              <Card>
                <div
                  style={{ height: "310px" }}
                  className="align-center text-center"
                >
                  <h3 className="text-primary mt-5 ">Notes Not Found !</h3>
                </div>
              </Card>
            ) : (
              !isLoading && (
                <div className="table-responsive">
                  <Table className="project-list-table table-sm table-nowrap align-middle table-borderless">
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: "30px" }}></th>
                        <th scope="col" className="">
                          Notes Title
                        </th>
                        <th scope="col">Posted On</th>
                        <th scope="col">Posted by</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notesList?.notes
                        ?.filter(n =>
                          keys.some(key =>
                            n[key]
                              .toLowerCase()
                              .includes(
                                search?.ch?.toLowerCase() ||
                                  search?.le?.toLowerCase()
                              )
                          )
                        )
                        .map((notes, index) => (
                          <tr key={index} className="p-0">
                            <td>
                              <i
                                className="bx bxs-file-pdf text-danger"
                                style={{ fontSize: "36px" }}
                              ></i>
                            </td>
                            <td>
                              <h5 className="text-truncate font-size-15">
                                <strong>{notes.subject}</strong>
                                <span className="text-muted text-truncate px-2 font-size-14">
                                  {notes.chapter}
                                </span>
                                <small className="text-truncate">
                                  {notes.lession}
                                </small>
                              </h5>
                              <p className="text-muted  mb-0">
                                {notes.st_class}
                              </p>
                            </td>
                            <td>
                              <p className="text-muted text-truncate font-size-14 pt-3">
                                {convertDate(notes.uploaded_date)}
                              </p>
                            </td>
                            <td>{notes.teacher_name}</td>
                            <td className="">
                              <div className="d-flex gap-3 align-items-center">
                                <a
                                  href={`${config.BaseImageUrl}/${notes.notes1}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-secondary pt-1"
                                >
                                  <i
                                    className="bx bx-download font-size-18"
                                    id="download"
                                  />
                                </a>
                                <Link
                                  to="#"
                                  className="text-danger"
                                  onClick={() => {
                                    onNotesDelete(notes.id)
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
              )
            )}
          </Row>
          <div className="col-12">
            <nav style={{ backgroundColor: "transparent", borderRadius: 10 }}>
              {notesList?.notes?.length === 0 ? (
                " "
              ) : (
                <ul className="pagination justify-content-center">
                  {Page && (
                    <Pagination
                      activePage={CurrentPage}
                      itemsCountPerPage={resultPerPage}
                      totalItemsCount={Page}
                      // totalItemsCount={
                      //   filteredProducts && productCount ? productCount : 0
                      // }
                      hideFirstLastPages={true}
                      onChange={e => setCurrentPage(e)}
                      nextPageText="Next"
                      prevPageText="Previous"
                      lastPageText="Last"
                      firstPageText="1st"
                      itemClass="page-item"
                      linkClass="page-link"
                      activeClass="active"
                      activeLinkClass="active"
                      hideDisabled={true}
                    />
                  )}
                </ul>
              )}
            </nav>
          </div>
        </Col>
      </Container>
    </div>
  )
}

export default Notes
