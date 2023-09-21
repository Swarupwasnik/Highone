import Breadcrumb from "components/Common/Breadcrumb"
import React, { useEffect, useState } from "react"
import {
  Button,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Row,
  Table,
} from "reactstrap"
import Select from "react-select"
import { useFormik } from "formik"
import * as Yup from "yup"
import Swal from "sweetalert2"
import { classApi } from "apis/ClassListApi"
import { Link } from "react-router-dom"
import { classGroupApi } from "apis/ClassGroupApi"

const Classgroup = () => {
  const [loading, setLoading] = useState(false)
  const [GroupName, setGroupName] = useState("")
  const [GroupClass, setGroupClass] = useState([])
  const [classList, setClassList] = useState([])
  const [AllClassGroup, setAllClassGroup] = useState([])

  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        setClassList(res.data.section_list)
      })
      .catch(err => {
        console.log(err)
      })
    getGroupClasses()
  }, [])

  const getGroupClasses = async () => {
    await classGroupApi.getClassGroup().then(res => {
      setAllClassGroup(res.data)
    })
  }

  const classListOption = classList?.map(cl => {
    return {
      value: cl.UID,
      label: `${cl.st_class} ${cl.st_sec}`,
    }
  })

  const handleEdit = e => {
    console.log(e)
  }
  const handleSubmit = e => {
    console.log(e)
  }
  const classhandleChange = selectedOption => {
    setGroupClass(selectedOption)
  }

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      group_name: GroupName,
      st_class: GroupClass,
    },
    validationSchema: Yup.object({
      group_name: Yup.string().required("Please Enter Group Name"),
      st_class: Yup.array().min(1, "Please Enter Your Class"),
    }),
    onSubmit: async values => {
      setLoading(true)
      const data = new FormData()
      data.append("group_name", values.group_name)
      data.append("st_class", JSON.stringify(values.st_class))
      await classGroupApi
        .addClassGroup(data)
        .then(res => {
          console.log(res.data)
          if (res.data.status === 200) {
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                console.log("success")
                window.location.reload()
              }
            })
            setLoading(false)
          }
          if (res.data.status === 403) {
            setLoading(false)
            Swal.fire({
              text: res.data.msg,
              icon: "warning",
              imageAlt: "warning image",
            }).then(result => {
              if (result.isConfirmed) {
                console.log("warning")
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
  })

  const onDelete = async id => {
    let body = {
      groupid: id,
    }
    await classGroupApi.removeClassGroup(body).then(res => {
      Swal.fire({
        text: res.data.msg,
        icon: "success",
        imageAlt: "success image",
      }).then(result => {
        if (result.isConfirmed) {
          console.log("success")
          getGroupClasses()
        }
      })
    })
  }
  const formClear = () => {
    validation.resetForm()
  }

  const convertStr = val => {
    let str = JSON.parse(val).map((item, i) => " " + item.label.toUpperCase())
    str = str.toString()
    str = str.slice(0, str.length - 1).trim()
    return str
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Container fluid={true} style={{ height: "80vh" }}>
            <Breadcrumb breadcrumbItem="Class Group" title="" />
            <Form
              onSubmit={e => {
                e.preventDefault()
                validation.handleSubmit()
              }}
            >
              <Row className="mb-5">
                <Col lg={4}>
                  <h6>Group Name</h6>
                  <Input
                    id="group_name"
                    name="group_name"
                    type="text"
                    className="form-control"
                    placeholder="Enter Group Name"
                    onChange={e => setGroupName(e.target.value)}
                    onBlur={validation.handleBlur}
                    value={validation.values.group_name}
                    invalid={
                      validation.touched.group_name &&
                      validation.errors.group_name
                        ? true
                        : false
                    }
                  />
                  {validation.touched.group_name &&
                  validation.errors.group_name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.group_name}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col lg={6}>
                  <h6>Choose Class</h6>
                  <Select
                    name="st_class"
                    classNamePrefix="select2-selection"
                    placeholder="Select Class..."
                    title="Class"
                    options={classListOption}
                    isMulti
                    onChange={classhandleChange}
                    onBlur={validation.handleBlur}
                    invalid={
                      validation.touched.st_class && validation.errors.st_class
                        ? true
                        : false
                    }
                  />
                  {validation.touched.st_class && validation.errors.st_class ? (
                    <div
                      style={{
                        color: "#f46a6a",
                        fontSize: "11px",
                        marginTop: "3px",
                      }}
                    >
                      Please Select Any Class Name
                    </div>
                  ) : null}
                </Col>
                <Col lg={2}>
                  <Button
                    color="primary"
                    type="submit"
                    className="btn btn-primary waves-effect waves-light mt-4"
                  >
                    Add Class Group
                  </Button>
                </Col>
              </Row>
            </Form>
            <div className="table-responsive">
              <Table className="table table-striped">
                <thead>
                  <tr className="text-center table-secondary">
                    <th className="text-center">Sr No</th>
                    <th>Group Name</th>
                    <th>Class Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {AllClassGroup?.grupofclass?.map(
                    ({ id, group_name, st_class }, index) => {
                      // const array = JSON.parse(st_class)
                      return (
                        <tr key={id} className="text-center">
                          <th scope="row" className="text-center">
                            {index + 1}
                          </th>
                          <td> {group_name}</td>
                          <td> {convertStr(st_class)}
                            {/* {array.map(
                              (item, i) => item.label.toUpperCase() + ", "
                            )} */}
                          </td>
                          <td className="text-center">
                            <Link
                              to="#"
                              className="text-danger"
                              onClick={() => {
                                onDelete(id)
                              }}
                            >
                              <i
                                className="mdi mdi-delete font-size-18"
                                id="deletetooltip"
                              />
                            </Link>
                          </td>
                        </tr>
                      )
                    }
                  )}
                </tbody>
              </Table>
            </div>
          </Container>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Classgroup
