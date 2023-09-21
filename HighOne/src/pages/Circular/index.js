import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Col,
  Container,
  Row,
  Label,
  Table,
  Card,
  CardBody,
  Spinner,
  UncontrolledTooltip,
  Button,
} from "reactstrap"
import config from "config/config"
import Breadcrumbs from "components/Common/Breadcrumb"
import CreateCircular from "./addCircular"
import { CircularApi } from "apis/CircularAPI"
import Swal from "sweetalert2"
import Loading from "components/Loading"
import Pagination from "react-js-pagination"
import { SessionContext } from "context/sessionContext"

const Circular = () => {
  document.title = "Circular"
  const { Session } = useContext(SessionContext)

  let session = Session || sessionStorage.getItem("SessionId")

  const [CurrentPage, setCurrentPage] = useState(1)
  const [Page, setPage] = useState(1)
  const resultPerPage = 10
  const [circularList, setCircularList] = useState([])
  const [loader, setLoader] = useState()

  let data = {
    session_id: session,
    resultPerPage: CurrentPage,
  }
  useEffect(() => {
    if (circularList?.length === 0) {
      setLoader(<Loading />)
    }
    CircularApi.getCircular(data)
      .then(res => {
        if (res.data.status === 200) {
          setLoader("")
        }
        setCircularList(res.data.circular)
        setPage(res.data.circular_count)
      })
      .catch(err => console.log(err))
  }, [CurrentPage, session])

  const onDelete = id => {
    let cid = {
      circular_id: id,
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
        CircularApi.deleteCircular(cid).then(res => {
          Swal.fire("Deleted!", res.data.msg, "success")
          window.location.href = "/circular"
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

  const convertStr = val => {
    let str = JSON.parse(val).map((item, i) => " " + item.label.toUpperCase())
    str = str.toString()
    str = str.slice(0, str.length - 1).trim()
    return str
  }

  const convertStrTo = val => {
    let str = JSON.parse(val).map((item, i) => item.label.toUpperCase() + " ")
    str = str.toString()
    str = str.slice(0, str.length - 1).trim()
    return str
  }

  return (
    <div className="page-content">
      <Container fluid>
        {/* Render Breadcrumb */}
        <Breadcrumbs title="" breadcrumbItem="Circular" />

        <Col xl="12" sm="12" className="mx-auto mb-1">
          <Row>
            <Card className="bg-transparent shadow-none pt-0">
              <CardBody className="p-0 text-end">
                <Link to="/add-circular">
                  <Button
                    color="primary"
                    className="btn btn-primary waves-effect waves-light"
                  >
                    <i className="bx bxs-add-to-queue p-1"></i>
                    Create Circular
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </Row>
        </Col>
        <Col xl="12" sm="12" className="mx-auto mb-4">
          <Card className="shadow-none">
            <CardBody>
              <Row>
                {loader ? <div>{loader}</div> : null}
                {circularList?.length === 0
                  ? !loader && (
                      <Card className="shadow-none">
                        <div
                          style={{ height: "310px" }}
                          className="align-center text-center"
                        >
                          <h2 className="text-primary mt-5 ">
                            Circular Not Found !
                          </h2>
                        </div>
                      </Card>
                    )
                  : !loader && (
                      <div className="table-responsive">
                        <Table className="table table-striped">
                          <thead>
                            <tr>
                              <th className="text-center">Sr No</th>
                              <th className="text-center">Title</th>
                              <th>Posted Date</th>
                              <th>Class</th>
                              <th>Sent To</th>
                              <th>File</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {circularList?.map((cir, index) => (
                              <tr key={index}>
                                <th scope="row" className="text-center">
                                  {(CurrentPage - 1) * 10 + index + 1}
                                </th>
                                <td className="text-start font-weight-bold">
                                  {cir.title.toUpperCase()}
                                </td>
                                <td> {convertDate(cir.notice_date)}</td>
                                <td>
                                  {convertStr(cir.st_class)}
                                  {/* {JSON.parse(cir.st_class).map(
                                  item => item.label.toUpperCase() + " , "
                                )} */}
                                </td>
                                <td>
                                  {convertStrTo(cir.send_by)}
                                  {/* {JSON.parse(cir.send_by).map(
                                    (item, i) => item.label.toUpperCase() + ", "
                                  )} */}
                                </td>
                                <td>
                                  <a
                                    href={`${config.BaseImageUrl}/${cir.notice_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-secondary"
                                  >
                                    <i
                                      className="bx bx-download font-size-18"
                                      id="download"
                                    />
                                  </a>{" "}
                                </td>
                                <td>
                                  <div className="d-flex gap-3">
                                    <Link
                                      to={`/edit-circular/${cir.id}`}
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
                                        onDelete(cir.id)
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
              <div className="col-12">
                <nav
                  style={{ backgroundColor: "transparent", borderRadius: 10 }}
                >
                  {circularList?.length === 0 ? (
                    ""
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
            </CardBody>
          </Card>
        </Col>
      </Container>
    </div>
  )
}

export default Circular
