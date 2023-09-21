import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import * as Yup from "yup"
import { useFormik } from "formik"
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap"
import Select from "react-select"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { PostApi } from "apis/PostApi"
import Swal from "sweetalert2"
import { classApi } from "apis/ClassListApi"
import "react-image-crop/dist/ReactCrop.css"
import Loading from "components/Loading"
import ImageResize from "./Crop/ImageResize"
import { SessionContext } from "context/sessionContext"
import { useClass } from "context/attendanceContext"
import { classGroupApi } from "apis/ClassGroupApi"

const AddPost = () => {
  document.title = "Add Post"
  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")
  const { classListOption } = useClass()
  const [selected, setSelected] = useState([])
  const [subselected, setSubSelected] = useState([])
  const [classarray, setClassarray] = useState([])
  const [classList, setClassList] = useState([])
  console.log(classList)
  const [selectedFiles, setselectedFiles] = useState([])
  const [files1, setFiles1] = useState(null)
  const [ShowImg, setShowImg] = useState("")
  const [title, setTitle] = useState("")
  const [descri, setdescri] = useState("")
  const [allowComment, setAllowComment] = useState(true)
  const [loading, setloading] = useState(false)

  const [check, SetCheck] = useState(false)
  const [thumbnail, setThumbnail] = useState()
  const [user, setUserLogged] = useState(
    JSON.parse(localStorage.getItem("User"))
  )

  const handleChange = selectedOption => {
    if (user === "Admin") {
      let array = selectedOption.map(({ value }) => value)
      let stringify = JSON.stringify(array)
      // console.log(stringify)
      let parse = JSON.parse(stringify)
      // console.log(parse)
      setSelected(parse)
    } else {
      setSelected(selectedOption)
    }
  }

  const subhandleChange = selectedOption => {
    setSubSelected(selectedOption)
  }

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }
  const handleDescriChange = event => {
    setdescri(event.target.value)
  }

  const [ClassGroup, setClassGroup] = useState([])
  const [AllClassGroup, setAllClassGroup] = useState([])

  const getGroupClasses = async () => {
    await classGroupApi.getClassGroup().then(res => {
      let arr = res.data?.grupofclass?.map(({ group_name, st_class }) => {
        return {
          label: group_name,
          value: st_class,
        }
      })

      let json = JSON.stringify(arr)
      setAllClassGroup(JSON.parse(json))

      let st_class = AllClassGroup.map(({ st_class }) => JSON.parse(st_class))
      let group = JSON.parse(json).map(({ group_name }, i) => {
        return {
          value: st_class[i],
          label: group_name,
        }
      })
      setClassGroup(group)
    })
  }

  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        setClassList(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    getGroupClasses()
  }, [])

  let suboption =
    user !== "Admin"
      ? user?.teacher_subject
          ?.filter(sub =>
            classList?.subject?.some(s => sub.subject_code === s.subject_code)
          )
          .map(sub => {
            let match = classList?.subject?.find(
              s => sub.subject_code === s.subject_code
            )
            return {
              value: match.subject_code,
              label: match.subject_name,
            }
          })
      : classList?.subject?.map(sub => {
          return {
            value: sub.subject_code,
            label: sub.subject_name,
          }
        })
  let subject_list = suboption?.filter((obj, index, arr, t) => {
    return index === arr.findIndex(d => d.value === obj.value)
  })
  const handleFileRead = async event => {
    const file = event.target.files[0]
    const base64 = await convertBase64(file)
    setShowImg(base64)
  }

  const convertBase64 = file => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const validationType = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: title,
      description: descri,
      st_class: selected ? selected : "",
      subject_code: subselected ? subselected : "",
      is_allow: allowComment ? "True" : "False",
      teacher_code: user?.payload?.t_code ? user?.payload?.t_code : "",
      teacher_name: user?.payload?.t_name ? user?.payload?.t_name : "Admin",
      media: files1,
      thumbnail: thumbnail,
    },

    validationSchema: Yup.object({
      title: Yup.string().required("This is required"),
      description: Yup.string().required("This is required"),
      media: Yup.mixed()
        .test(
          "fileSize",
          "File size exceeds the limit of 5 MB.",
          value => !value || value.size <= MAX_FILE_SIZE
        )
        .notRequired(),

      thumbnail: Yup.mixed()
        .test(
          "fileSize",
          "thumbnail size exceeds the limit of 5 MB.",
          value => !value || value.size <= MAX_FILE_SIZE
        )
        .notRequired(),
      st_class: Yup.array().min(1, "This is required"),
      subject_code: Yup.array().min(1, "This is required"),
    }),
    onSubmit: values => {
      setloading(true)
      const data = new FormData()
      data.append("title", values.title)
      data.append("description", values.description)
      data.append(
        "st_class",
        user === "Admin"
          ? values.st_class.toString().replace(/\],\[/g, ",")
          : JSON.stringify(selected)
      )
      data.append("subject_code", JSON.stringify(subselected))
      data.append("is_allow", values.is_allow)
      data.append("teacher_code", values.teacher_code)
      data.append("teacher_name", values.teacher_name)
      data.append("media", files1)
      data.append("profile_pic_url", user?.payload?.profile_pic_url ? user?.payload?.profile_pic_url : "")
      data.append("session_id", session)
      data.append("thumbnail", thumbnail)
      PostApi.createPost(data)
        .then(res => {
          if (res.data.status === 200) {
            setloading(false)
            Swal.fire({
              text: res.data.msg,
              icon: "success",
              imageAlt: "success image",
            }).then(result => {
              if (result.isConfirmed) {
                window.location.href = "/post"
              }
            })
          }
        })
        .catch(err => console.log(err.message))
    },
  })

  // Crop Image Code
  // const [imageToCrop, setImageToCrop] = useState(undefined)
  // const [croppedImage, setCroppedImage] = useState(undefined)

  // if (check === "Image") {
  //   fetch(croppedImage)
  //     .then(response => response.blob())
  //     .then(blobData => {
  //       const file = new File([blobData], "image.jpg", { type: "image/jpeg" })
  //       setFiles1(file)
  //     })
  //     .catch(error => {
  //       console.error("Error fetching Blob data:", error)
  //     })
  // }

  // const onUploadFile = event => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const reader = new FileReader()

  //     reader.addEventListener("load", () => {
  //       const image = reader.result
  //       setImageToCrop(image)
  //     })

  //     reader.readAsDataURL(event.target.files[0])
  //   }
  // }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Post List" breadcrumbItem="Add Post" />
          <Row>
            <Col xs="12">
              <Card>
                {loading ? (
                  <Loading />
                ) : (
                  <CardBody>
                    <CardTitle>Information</CardTitle>
                    <p className="card-title-desc mb-4">
                      Fill all information below
                    </p>
                    <Form
                      onSubmit={e => {
                        e.preventDefault()
                        validationType.handleSubmit()
                      }}
                    >
                      <Row>
                        <Col sm="6">
                          <div className="mb-3">
                            <Label htmlFor="posttitle" className="my-control">
                              Title
                            </Label>
                            <Input
                              id="posttitle"
                              name="title"
                              type="text"
                              className="form-control"
                              placeholder="Title"
                              onChange={handleTitleChange}
                              // onChange={validationType.handleChange}
                              onBlur={validationType.handleBlur}
                              value={validationType.values.title || ""}
                              invalid={
                                validationType.touched.title &&
                                validationType.errors.title
                                  ? true
                                  : false
                              }
                            />
                            {validationType.touched.title &&
                            validationType.errors.title ? (
                              <FormFeedback type="invalid">
                                {validationType.errors.title}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label className="form-label my-control">
                              Description
                            </Label>
                            <Input
                              name="description"
                              rows="5"
                              placeholder="Write here your post description....."
                              type="textarea"
                              // onChange={validationType.handleChange}
                              onChange={handleDescriChange}
                              onBlur={validationType.handleBlur}
                              value={validationType.values.description || ""}
                              invalid={
                                validationType.touched.description &&
                                validationType.errors.description
                                  ? true
                                  : false
                              }
                            />
                            {validationType.touched.description &&
                            validationType.errors.description ? (
                              <FormFeedback type="invalid">
                                {validationType.errors.description}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            {user === "Admin" ? (
                              <>
                                <Label className="control-label my-control">
                                  Class Group
                                </Label>
                                <Select
                                  name="st_class"
                                  classNamePrefix="select2-selection"
                                  placeholder="Select Class..."
                                  title="Class"
                                  options={AllClassGroup}
                                  isMulti
                                  onChange={handleChange}
                                  onBlur={validationType.handleBlur}
                                  invalid={
                                    validationType.touched.st_class &&
                                    validationType.errors.st_class
                                      ? true
                                      : false
                                  }
                                />
                              </>
                            ) : (
                              <>
                                <Label className="control-label my-control">
                                  Class
                                </Label>
                                <Select
                                  name="st_class"
                                  classNamePrefix="select2-selection"
                                  placeholder="Select Class..."
                                  title="Class"
                                  options={classListOption}
                                  isMulti
                                  onChange={handleChange}
                                  onBlur={validationType.handleBlur}
                                  invalid={
                                    validationType.touched.st_class &&
                                    validationType.errors.st_class
                                      ? true
                                      : false
                                  }
                                />
                              </>
                            )}
                            {validationType.touched.st_class &&
                            validationType.errors.st_class ? (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "11px",
                                  marginTop: "3px",
                                }}
                              >
                                {/* {validationType.errors.st_class} */}
                                This is required
                              </div>
                            ) : null}
                          </div>
                        </Col>

                        <Col sm={6}>
                          <div className="mb-3">
                            <Label htmlFor="validationCustom01" className="">
                              Upload
                            </Label>
                            <Input
                              type="radio"
                              className="form-check-Input mx-2"
                              id="formrow-customCheck"
                              checked={check === "Image" ? true : false}
                              onChange={e => {
                                SetCheck("Image"), setShowImg("")
                              }}
                            />
                            Image
                            <Input
                              type="radio"
                              className="form-check-Input mx-2"
                              id="formrow-customCheck"
                              checked={check === "PDF" ? true : false}
                              onChange={e => {
                                SetCheck("PDF"), setShowImg("")
                              }}
                            />
                            Document
                            {check === "Image" ? (
                              <div>
                                <Label htmlFor="Image" className="">
                                  Image
                                </Label>
                                <Input
                                  name="media"
                                  placeholder="Enter Image Url"
                                  type="file"
                                  className="form-control"
                                  accept="image/*"
                                  onChange={e => {
                                    handleFileRead(e),
                                      validationType.setFieldValue(
                                        "media",
                                        e.target.files[0]
                                      ),
                                      setFiles1(e.target.files[0])
                                  }}
                                  invalid={
                                    validationType.touched.media &&
                                    validationType.errors.media
                                      ? true
                                      : false
                                  }
                                />
                                {validationType.touched.media &&
                                validationType.errors.media ? (
                                  <FormFeedback type="invalid">
                                    {validationType.errors.media}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            ) : null}
                            {check === "PDF" ? (
                              <div className="d-flex gap-1">
                                <div>
                                  <Label htmlFor="pdf" className="">
                                    Pdf
                                  </Label>
                                  <Input
                                    name="media"
                                    placeholder="Enter Image Url"
                                    type="file"
                                    className="form-control"
                                    accept="application/pdf"
                                    onChange={e => {
                                      validationType.setFieldValue(
                                        "media",
                                        e.target.files[0]
                                      ),
                                        setFiles1(e.target.files[0])
                                    }}
                                    invalid={
                                      validationType.touched.media &&
                                      validationType.errors.media
                                        ? true
                                        : false
                                    }
                                  />
                                  {validationType.touched.media &&
                                  validationType.errors.media ? (
                                    <FormFeedback type="invalid">
                                      {validationType.errors.media}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                                <div>
                                  <Label htmlFor="thumbnail" className="">
                                    Thumbnail
                                  </Label>
                                  <Input
                                    name="thumbnail"
                                    placeholder="thumbnails"
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={e => {
                                      handleFileRead(e),
                                        validationType.setFieldValue(
                                          "thumbnail",
                                          e.target.files[0]
                                        ),
                                        setThumbnail(e.target.files[0])
                                    }}
                                    invalid={
                                      validationType.touched.thumbnail &&
                                      validationType.errors.thumbnail
                                        ? true
                                        : false
                                    }
                                  />
                                  {validationType.touched.thumbnail &&
                                  validationType.errors.thumbnail ? (
                                    <FormFeedback type="invalid">
                                      {validationType.errors.thumbnail}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </div>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <Label className="control-label my-control">
                              Subject
                            </Label>
                            <Select
                              name="subject_code"
                              classNamePrefix="select2-selection"
                              placeholder="Select Subject..."
                              title="Subject"
                              options={subject_list}
                              isMulti
                              onChange={subhandleChange}
                              onBlur={validationType.handleBlur}
                              invalid={
                                validationType.touched.subject_code &&
                                validationType.errors.subject_code
                                  ? true
                                  : false
                              }
                            />
                            {validationType.touched.subject_code &&
                            validationType.errors.subject_code ? (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "11px",
                                  marginTop: "3px",
                                }}
                              >
                                {/* {validationType.errors.subject_code} */}
                                This is required
                              </div>
                            ) : null}
                          </div>
                          <div className="mb-3 d-flex">
                            <Label
                              className="form-check-Label me-2"
                              htmlFor="formrow-customCheck"
                            >
                              Comments
                            </Label>

                            <div className="square-switch">
                              <input
                                type="checkbox"
                                id="square-switch1"
                                className="switch"
                                defaultChecked={allowComment}
                                onChange={() => setAllowComment(!allowComment)}
                              />
                              <label
                                htmlFor="square-switch1"
                                data-on-label="On"
                                data-off-label="Off"
                              />
                            </div>
                          </div>

                          <div className="mb-3 d-flex">
                            {ShowImg ? (
                              <img
                                alt="Cropped Img"
                                src={ShowImg}
                                className="crop_img"
                              />
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                      <div className="d-flex flex-wrap gap-2">
                        <Button type="submit" color="primary" className="btn ">
                          SUBMIT
                        </Button>
                        <a
                          href="/post"
                          color="primary"
                          className="btn btn-danger"
                        >
                          CANCEL
                        </a>
                      </div>
                    </Form>
                  </CardBody>
                )}
              </Card>
            </Col>
            <Col sm="12">
              <Row>
                <Col>
                  {/* <ImageResize
                    imageToCrop={imageToCrop}
                    onImageCropped={croppedImage =>
                      setCroppedImage(croppedImage)
                    }
                  /> */}
                  {/* {ShowImg ? <img alt="Cropped Img" src={ShowImg}  className="crop_img" /> : null} */}
                </Col>
                <Col>
                  {/* {croppedImage && <img alt="Cropped Img" src={croppedImage} />} */}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AddPost
