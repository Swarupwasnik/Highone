import React, { useEffect, useState, useContext } from "react"
import { Link, useParams } from "react-router-dom"
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
import Dropzone from "react-dropzone"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { PostApi } from "apis/PostApi"
import { error } from "toastr"
import Swal from "sweetalert2"
import { classApi } from "apis/ClassListApi"
import config from "config/config"
import pdf from "../../assets/images/users/PDF_file_icon.svg.png"
import { SessionContext } from "context/sessionContext"
import ImageResize from "./Crop/ImageResize"
import { useClass } from "context/attendanceContext"
import Loading from "components/Loading"
import { classGroupApi } from "apis/ClassGroupApi"

const EditPost = () => {
  document.title = "Edit Post"
  const { Session } = useContext(SessionContext)
  let session = Session || sessionStorage.getItem("SessionId")
  const { classListOption } = useClass()
  const [user, setUserLogged] = useState(
    JSON.parse(localStorage.getItem("User"))
  )
  const [selected, setSelected] = useState([])
  const [subselected, setSubSelected] = useState()
  const [classList, setClassList] = useState([])
  const [selectedFiles, setselectedFiles] = useState([])
  const [files1, setFiles1] = useState()
  const [ShowImg, setShowImg] = useState("")
  const [allowComment, setAllowComment] = useState(false)
  const [filterClass, setFilterClass] = useState()
  const { post_id } = useParams()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [check, SetCheck] = useState("")
  // const [imageToCrop, setImageToCrop] = useState(undefined)
  // const [croppedImage, setCroppedImage] = useState(undefined)
  const [thumbnail, setThumbnail] = useState([])
  const [loading, setloading] = useState(false)

  const [postData, setPostData] = useState([])

  console.log(postData)
  console.log(files1)
  useEffect(() => {
    let teacherCode = {
      user_type: user == "Admin" ? "Admin" : "Teacher",
      teacher_code: user?.payload?.t_code ? user?.payload?.t_code : "",
      class: "",
      section: "",
      resultPerPage: 1,
      session_id: session,
    }

    PostApi.GetPost(teacherCode)
      .then(res => {
        let uniquePost = res.data.post?.find(
          post => post.id === Number(post_id)
        )
        setPostData(uniquePost)
        setTitle(uniquePost.title)
        setDescription(uniquePost.description)
        setAllowComment(uniquePost.is_allow)
        setSelected(JSON.parse(uniquePost.st_class))
        setSubSelected(JSON.parse(uniquePost.subject_code))
        setFiles1(uniquePost.media)
        if (uniquePost.media.split(".").at(-1) == "pdf") {
          SetCheck("pdf")
        } else {
          SetCheck("Image")
        }
      })
      .catch(err => console.log(err.message))
    classApi
      .getAllClass()
      .then(res => {
        setClassList(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    // classListOptiontest3()
    getGroupClasses()
  }, [])

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

  const handleChange = selectedOption => {
    setSelected(selectedOption)
    // if (user === "Admin") {
    //   let array = selectedOption.map(({ value }) => value)
    //   let stringify = JSON.stringify(array)
    //   // console.log(stringify)
    //   let parse = JSON.parse(stringify)
    //   // console.log(parse)
    //   setSelected(parse)
    // } else {
    // }
  }

  const subhandleChange = selectedOption => {
    setSubSelected(selectedOption)
  }
  const commentChange = () => {
    if (allowComment === true) {
      setAllowComment(false)
    } else {
      setAllowComment(true)
    }
  }

  const handleTitleChange = event => {
    setTitle(event.target.value)
  }
  const handleDescriChange = event => {
    setDescription(event.target.value)
  }

  let suboption = user?.teacher_subject
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
  let subject_list = suboption?.filter((obj, index, arr, t) => {
    return index === arr.findIndex(d => d.value === obj.value)
  })
  const classListOptiontest = classList?.section_list
    ?.filter(cl => cl.UID == 1)
    .map(cl => {
      return {
        value: cl.UID,
        label: `${cl.st_class} ${cl.st_sec}`,
      }
    })

  // const classListOptiontest3 = () => {
  //   var classListOption1 = []
  //   classList?.section_list?.map(item => {
  //     let classString = `${item.st_class} ${item.st_sec}`

  //     for (var i = 0; i != filterClass.length; i++) {
  //       if (classString == filterClass[i]) {
  //         var classListOption1 = []
  //         var classListOption12 = []
  //         classListOption12 = {
  //           // return {
  //           value: item.UID,
  //           label: `${item.st_class} ${item.st_sec}`,
  //           // }
  //         }
  //         classListOption1.push(classListOption12)

  //         const obj1 = Object.assign({}, classListOption1)
  //       }
  //     }
  //   })
  // }

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setselectedFiles(files)
  }

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
  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const handleFileRead = async event => {
    const file = event.target.files[0]
    if (file.size <= MAX_FILE_SIZE) {
      const base64 = await convertBase64(file)
      setShowImg(base64)
    } else {
      Swal.fire({
        text: "Please select less then 5 mb",
        icon: "warning",
        imageAlt: "warning image",
      }).then(e => {
        setFiles1("")
        setThumbnail("")
      })
    }
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

  const validationType = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: title,
      description: description,
      st_class: selected,
      subject_code: subselected,
      is_allow: allowComment ? "True" : "False",
      teacher_code: user?.payload?.t_code ? user?.payload?.t_code : "",
      teacher_name: user?.payload?.t_name ? user?.payload?.t_name : "Admin",
      media: files1,
      thumbnail: thumbnail,
    },

    validationSchema: Yup.object({
      title: Yup.string().required("This is required"),
      description: Yup.string().required("This is required"),
      st_class: Yup.array().min(1, "This is required"),
      subject_code: Yup.array().min(1, "This is required"),
      // media: Yup.mixed()
      //   .test(
      //     "fileSize",
      //     "File size exceeds the limit of 5 MB.",
      //     value => !value || value.size <= MAX_FILE_SIZE
      //   )
      //   ,
      // thumbnail:  Yup.mixed()
      //   .test(
      //     "fileSize",
      //     "thumbnail size exceeds the limit of 5 MB.",
      //     value => !value || value.size <= MAX_FILE_SIZE
      //   )
      //    ,
    }),
    onSubmit: values => {
      setloading(true)
      const data = new FormData()
      data.append("title", values.title)
      data.append("description", values.description)
      data.append("media", files1)
      data.append("st_class", JSON.stringify(selected))
      // data.append(
      //   "st_class",
      //   user === "Admin"
      //     ? values.st_class.toString().replace(/\],\[/g, ",")
      //     : JSON.stringify(selected)
      // )
      data.append("subject_code", JSON.stringify(subselected))
      data.append("is_allow", values.is_allow)
      data.append("teacher_code", values.teacher_code)
      data.append("teacher_name", values.teacher_name)
      data.append("post_id", post_id)
      data.append("session_id", session)
      data.append("thumbnail", thumbnail)
      PostApi.updatePost(data)
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
          <Breadcrumbs title="Post" breadcrumbItem="Edit Post" />
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
                              onChange={handleDescriChange}
                              // onChange={validationType.handleChange}
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
                              value={selected}
                              onChange={handleChange}
                              onBlur={validationType.handleBlur}
                              invalid={
                                validationType.touched.st_class &&
                                validationType.errors.st_class
                                  ? true
                                  : false
                              }
                            />
                            {/* {user === "Admin" ? (
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
                            )} */}
                            {validationType.touched.st_class &&
                            validationType.errors.st_class ? (
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "11px",
                                  marginTop: "3px",
                                }}
                              >
                                {validationType.errors.st_class}
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
                              onClick={e => SetCheck("Image")}
                            />
                            Image
                            <Input
                              type="radio"
                              className="form-check-Input mx-2"
                              id="formrow-customCheck"
                              checked={check === "pdf" ? true : false}
                              onClick={e => SetCheck("pdf")}
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
                            {check === "pdf" ? (
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
                                    // accept="image/png, image/jpeg, application/pdf"
                                    // accept=".pdf,.docx"
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
                                </div>
                                {validationType.touched.media &&
                                validationType.errors.media ? (
                                  <FormFeedback type="invalid">
                                    {validationType.errors.media}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            ) : null}
                          </div>

                          {/* <div className="mb-3">
                            <Label htmlFor="validationCustom01">
                              Upload Image or PDF
                            </Label>
                            <Input
                              name="media"
                              placeholder="Enter Banner Image Url"
                              type="file"
                              className="form-control"
                              onChange={e => {
                                setFiles1(e.target.files[0])
                                validationType.setFieldValue(
                                  "media",
                                  e.target.files[0]
                                )
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
                              <div
                                style={{
                                  color: "#f46a6a",
                                  fontSize: "11px",
                                  marginTop: "3px",
                                }}
                              >
                                {validationType.errors.media}
                              </div>
                            ) : null}
                          </div> */}
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
                              value={subselected}
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
                                {validationType.errors.subject_code}
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
                                name="is_allow"
                                id="square-switch1"
                                className="switch"
                                defaultChecked={postData && postData?.is_allow}
                                // onChange={() => setAllowComment(!allowComment)}
                                // onChange={commentChange}
                                onClick={e => {
                                  if (allowComment === true) {
                                    setAllowComment(false)
                                  }
                                  if (allowComment === false) {
                                    setAllowComment(true)
                                  }
                                }}
                              />
                              <label
                                htmlFor="square-switch1"
                                data-on-label="On"
                                data-off-label="Off"
                              />
                            </div>
                          </div>
                          <div className="position-relative">
                            {/* <div>
                              {(postData?.media &&
                                postData?.media?.split(".").at(-1) == "jpg") ||
                              "jpeg" ||
                              "png" ? (
                                <img
                                  src={`${config.BaseImageUrl}/${postData?.media}`}
                                  alt=""
                                  width="200"
                                  className="crop_img"
                                />
                              ) : (
                                <a
                                  href={`${config.BaseImageUrl}/${postData?.media}`}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                  className="text-muted"
                                >
                                  <img src={pdf} alt="" width="80" />
                                </a>
                              )}

                              {postData?.media &&
                              postData.media.split(".").at(-1) == "pdf" ? (
                                <a
                                  href={`${config.BaseImageUrl}/${postData?.media}`}
                                  className="my_post"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={`${config.BaseImageUrl}/${postData?.thumbnail}`}
                                    alt=""
                                    className="crop_img"
                                  />
                                </a>
                              ) : (
                                // <iframe
                                //   src={`${config.BaseImageUrl}/${postData?.media}`}
                                //   frameBorder="0"
                                //   height="200px"
                                //   width="578"
                                // ></iframe>
                                // <a
                                //   href={`${config.BaseImageUrl}/${postData?.media}`}
                                //   rel="noopener noreferrer"
                                //   target="_blank"
                                //   className="text-muted"
                                // >
                                //   <img
                                //     src={pdf}
                                //     alt=""
                                //     width="100"
                                //   />
                                // </a>
                                <></>
                              )}
                            </div> */}
                            <div>
                              {ShowImg ? (
                                <img
                                  alt="Cropped Img"
                                  src={ShowImg}
                                  className="crop_img"
                                />
                              ) : null}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <div className="d-flex flex-wrap gap-2">
                        <Button type="submit" color="primary" className="btn ">
                          UPDATE
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
                  {/* {ShowImg ? <img alt="Cropped Img" src={ShowImg} /> : null} */}
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

export default EditPost
