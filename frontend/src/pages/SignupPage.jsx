import { Card, Container, Row, Col } from 'react-bootstrap';
import SignupImage from '../assets/signup-img.jpg';
import { Header } from '../components/Header';
import { SignupForm } from '../components/SignupForm';
import { Navigate } from 'react-router';

export const SignupPage = () => {
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <Header />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
        <Container>
          <Card className="mx-auto shadow-sm" style={{ maxWidth: '900px' }}>
            <Card.Body className="p-5 p-md-5">
              <Row className="align-items-center g-4">
                <Col md={6} className="text-center">
                  <img
                    src={SignupImage}
                    alt=""
                    className="img-fluid"
                    style={{ borderRadius: '50%' }}
                  />
                </Col>
                <Col md={6}>
                  <Card.Title className="mb-4 text-center fs-1 fw-semibold">
                    Регистрация
                  </Card.Title>
                  <SignupForm />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </main>
    </>
  );
};
