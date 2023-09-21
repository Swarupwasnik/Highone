import React from "react"
import PropTypes from "prop-types"
import { Link, useNavigate } from "react-router-dom"
import { Row, Col, BreadcrumbItem, Button } from "reactstrap"

const Breadcrumb = props => {
  const navigate = useNavigate()

  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18"></h4>
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              <BreadcrumbItem>
                <Link to="#" onClick={() => navigate(-1)}>
                  <Button color="info" size="sm">
                    Back
                  </Button>
                </Link>
              </BreadcrumbItem>
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  )
}

Breadcrumb.propTypes = {
  breadcrumbItems: PropTypes.array,
  title: PropTypes.string,
}

export default Breadcrumb
