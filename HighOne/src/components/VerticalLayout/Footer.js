import React from "react"
import { Container, Row, Col } from "reactstrap"
import { Link } from "react-router-dom"
const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer d-flex justify-content-end">
        <Link
          to="#"
          className="text-secondary bg-light rounded-circle"
          // onClick={() => {
          //   const orderData = cellProps.row.original;
          //   handleOrderClick(orderData);
          // }}
        ><i className="bx bx-conversation font-size-18 p-1 align-center"></i>
        </Link>
        
        {/* <Container fluid={true}>
          <Row>
            <Col md={6}>{new Date().getFullYear()} © Skote.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                Design & Develop by Themesbrand
              </div>
            </Col>
          </Row>
        </Container> */}
      </footer>
    </React.Fragment>
  )
}

export default Footer
