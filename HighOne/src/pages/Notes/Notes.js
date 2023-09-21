import PropTypes from "prop-types"
import React from "react"
import { Link } from "react-router-dom"
import { Card, Col, Row ,Table} from "reactstrap"
import config from "config/config"

const NotesCard = props => {
  const { notes, onNotesDelete } = props
  // const name = shop.name
  // const nameIcon = name.charAt(0)

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
      <Col xl="10" sm="12" className="mx-auto">
        <Card className="rounded">
          <div className="px-2">
            <Row>
              <Col xs="6">
                <div className="d-flex align-items-center">
                  <i
                    className="bx bxs-file-pdf text-danger  pt-2"
                    style={{ fontSize: "24px" }}
                  ></i>
                  <h5 className="text-muted text-truncate pt-3">
                    {notes.chapter} ({notes.subject})
                  </h5>
                </div>
              </Col>
              <Col xs="4">
                <div className="d-flex align-items-center">
                  <p className="text-muted text-truncate font-size-14 pt-3">
                    Posted on {convertDate(notes.uploaded_date)}
                  </p>
                </div>
              </Col>
              <Col xs="2">
                <div className="d-flex gap-3 align-items-center pt-3">
                  <a
                    href={`${config.BaseImageUrl}/${notes.notes1}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary pt-1"
                  >
                    <i className="bx bx-download font-size-18" id="download" />
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
                  {/* <Link
                    to="#"
                    className="success"
                    // onClick={() => {
                    //   onNotesDelete(notes.id)
                    // }}
                  >
                   <i className='bx bxs-edit font-size-18 pt-1'></i>
                  </Link> */}
                </div>
              </Col>
            </Row>
          
          </div>
        </Card>
      </Col>
    </React.Fragment>
  )
}

NotesCard.propTypes = {
  shop: PropTypes.object,
}

export default NotesCard
