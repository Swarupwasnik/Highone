import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Label,
  ModalHeader,
  FormFeedback,
  ModalBody,
} from "reactstrap"
import Breadcrumbs from "components/Common/Breadcrumb"
import Swal from "sweetalert2"
import Loading from "components/Loading"
import { HolidayApi } from "apis/HolidayApi"
import * as Yup from "yup"
import { useFormik } from "formik"
import { SessionContext } from "context/sessionContext"

const Holiday = () => {
  document.title = "Holiday "
  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")
  const [holidayList, setHolidayList] = useState([])
  const [isHoliday, SetIsHoliday] = useState()
  const [loader, setLoader] = useState()
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (holidayList?.length === 0) {
      setLoader(<Loading />)
    }
    const data = {
      session_id: session,
    }
    HolidayApi.getHoliday(data)
      .then(res => {
        if (res.data.status === 200) {
          setLoader("")
        }
        setHolidayList(res.data)
      })
      .catch(err => console.log(err.message))
  }, [session])

  const onDelete = id => {
    let sid = {
      holiday_id: id,
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
        HolidayApi.deleteHoliday(sid).then(res => {
          Swal.fire("Deleted!", res.data.msg, "success")
          window.location.href = "/holiday"
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

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      holiday_name: (isHoliday && isHoliday.holiday_name) || "",
      holiday_date: (isHoliday && isHoliday.holiday_date) || "",
      holiday_id: (isHoliday && isHoliday.id) || "",
      session_id: session,
    },
    validationSchema: Yup.object({
      holiday_name: Yup.string().required("Please Enter Your Holiday Name"),
      holiday_date: Yup.string().required("Please Enter Your Holiday Date"),
    }),
    onSubmit: values => {
      HolidayApi.createHoliday(values)
        .then(res => {
          if (res.data.status === 200) {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/holiday"
                toggle()
              }
            })
          }
          if (res.data.status === 403) {
            Swal.fire({
              text: res.data.msg,
              icon: "info",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                toggle()
              }
            })
          }
        })
        .catch(err => console.log(err.message))
    },
  })

  const [modal, setModal] = useState(false)
  const toggle = () => {
    if (modal) {
      formClear()
      setModal(false)
    } else {
      setModal(true)
    }
  }
  const formClear = () => {
    validation.resetForm()
  }
  const handleProjectClick = arg => {
    SetIsHoliday()
    setIsEdit(false)
    toggle()
  }
  const handleProjectEdit = arg => {
    let holiday = arg
    SetIsHoliday({
      id: holiday.id,
      holiday_date: holiday.holiday_date,
      holiday_name: holiday.holiday_name,
    })
    setIsEdit(true)
    toggle()
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Holiday" breadcrumbItem="Holiday List" />
          <Col xl="10" sm="12" className="mx-auto mb-4">
            <Row>
              <Col md={3} className=""></Col>
              <Col md={3} className=""></Col>
              <Col md={2}></Col>
              <Col md={4} className="">
                <Card className="bg-transparent shadow-none pt-0">
                  <CardBody className="p-0 text-end">
                    <Button
                      onClick={() => handleProjectClick()}
                      color="primary"
                      className="btn btn-primary waves-effect waves-light"
                    >
                      <i className="bx bxs-add-to-queue p-1"></i>
                      Add Holiday
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col xl="10" sm="12" className="mx-auto mb-4">
            <Card>
              <CardBody>
                <Row>
                  {loader ? <div>{loader}</div> : null}

                  {holidayList?.length === 0 ? (
                    <Card className="shadow-none">
                      <div
                        style={{ height: "310px" }}
                        className="align-center text-center"
                      >
                        <h2 className="text-primary mt-5 ">
                          Holiday Not Found !
                        </h2>
                      </div>
                    </Card>
                  ) : (
                    !loader && (
                      <div className="table-responsive">
                        <Table className="table table-striped">
                          <thead>
                            <tr className="text-center table-secondary">
                              <th className="text-center">Sr No</th>
                              <th>Name</th>
                              <th>Date</th>
                              {/* <th>Day</th> */}
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {holidayList?.upcomming_holiday?.map(
                              (holiday, index) => (
                                <tr key={index} className="text-center">
                                  <th scope="row" className="text-center">
                                    {index + 1}
                                  </th>
                                  <td className="text-start">
                                    {holiday.holiday_name}
                                  </td>

                                  <td> {convertDate(holiday.holiday_date)}</td>
                                  {/* <td> Monday</td> */}

                                  <td>
                                    <div className="d-flex justify-content-center gap-3">
                                      <Link
                                        onClick={() =>
                                          handleProjectEdit(holiday)
                                        }
                                        className="text-success"
                                      >
                                        <i
                                          className="mdi mdi-pencil font-size-18"
                                          id="edittooltip"
                                        />
                                      </Link>
                                      <Link
                                        to="#"
                                        className="text-danger"
                                        onClick={() => {
                                          onDelete(holiday.id)
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
                              )
                            )}
                            {holidayList?.past_holiday?.map(
                              (holiday, index) => (
                                <tr key={index} className="text-center">
                                  <th scope="row" className="text-center">
                                    {index + 1}
                                  </th>
                                  <td className="text-start">
                                    {holiday.holiday_name}
                                  </td>

                                  <td> {convertDate(holiday.holiday_date)}</td>
                                  {/* <td> Monday</td> */}

                                  <td>
                                    <div className="d-flex justify-content-center gap-3">
                                      <Link
                                        onClick={() =>
                                          handleProjectEdit(holiday)
                                        }
                                        className="text-success"
                                      >
                                        <i
                                          className="mdi mdi-pencil font-size-18"
                                          id="edittooltip"
                                        />
                                      </Link>
                                      <Link
                                        to="#"
                                        className="text-danger"
                                        onClick={() => {
                                          onDelete(holiday.id)
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
                              )
                            )}
                          </tbody>
                        </Table>
                      </div>
                    )
                  )}
                </Row>
              </CardBody>
            </Card>
            <div>
              <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle} tag="h4">
                  {isEdit ? "Update Holiday" : "Add Holiday"}
                </ModalHeader>
                <ModalBody>
                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      validation.handleSubmit()
                      return false
                    }}
                  >
                    <Row>
                      <Col sm={12}>
                        <div className="mb-2">
                          <Label
                            htmlFor="name"
                            className="form-label my-control"
                          >
                            Name
                          </Label>
                          <Input
                            className="form-control"
                            id="name"
                            name="holiday_name"
                            type="text"
                            placeholder="Holiday Name"
                            onBlur={validation.handleBlur}
                            value={validation.values.holiday_name}
                            onChange={validation.handleChange}
                            invalid={
                              validation.touched.holiday_name &&
                              validation.errors.holiday_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.holiday_name &&
                          validation.errors.holiday_name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.holiday_name}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-2">
                          <Label
                            htmlFor="date"
                            className="form-label my-control"
                          >
                            Date
                          </Label>
                          <Input
                            className="form-control"
                            id="date"
                            name="holiday_date"
                            type="date"
                            placeholder="Name"
                            onBlur={validation.handleBlur}
                            value={validation.values.holiday_date}
                            onChange={validation.handleChange}
                            invalid={
                              validation.touched.holiday_date &&
                              validation.errors.holiday_date
                                ? true
                                : false
                            }
                          />
                          {validation.touched.holiday_date &&
                          validation.errors.holiday_date ? (
                            <FormFeedback type="invalid">
                              {validation.errors.holiday_date}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="text-end pt-5">
                          <button
                            type="submit"
                            className="btn btn-success save-user"
                          >
                            {isEdit ? "Update" : "Add"}
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </ModalBody>
              </Modal>
            </div>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Holiday
