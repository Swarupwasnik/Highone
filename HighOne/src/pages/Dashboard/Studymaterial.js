import React from "react"
import { Card, CardBody, Col, Row } from "reactstrap"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en.json"
import ru from "javascript-time-ago/locale/ru.json"
import ReactTimeAgo from "react-time-ago"
import config from "config/config"

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const Studymaterial = props => {
  return (
    <a
      key={props.id}
      href={`${config.BaseImageUrl}/${props.notes1}`}
      target="_blank"
      rel="noreferrer"
    >
      <Col xl="12" sm="12">
        <Card className="bg-light">
          <div className="text-xl-start">
            <Row>
              <Col xs="4">
                <div className="p-2 d-flex ">
                  <i
                    className="bx bxs-file-pdf text-danger bg-light"
                    style={{ fontSize: "48px", borderRadius: 20 }}
                  ></i>
                  <div className="px-2">
                    <h5 className="text-truncate text-dark">
                      {props.subject}
                    </h5>
                    <h6 className="text-dark mb-2 text-truncate">
                      {props.chapter}
                    </h6>
                  </div>
                </div>
              </Col>
              <Col xs="6">
                <h5 className="text-truncate text-dark m-auto p-2">
                  {props.lession}
                </h5>
              </Col>
              <Col xs="2">
                <div>
                  <p className="text-dark m-2 font-size-10">
                    <ReactTimeAgo date={props.uploaded_date} locale="en-US" />
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </a>
  )
}

export default Studymaterial
