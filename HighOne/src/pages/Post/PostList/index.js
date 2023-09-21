import React from "react"
import { Container, Row } from "reactstrap"
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import PostList from "./PostList"

const Index = () => {
  document.title = "Post List "
  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Post" breadcrumbItem="Post List" />
        <Row>
          <PostList />
        </Row>
      </Container>
    </div>
  )
}

export default Index
