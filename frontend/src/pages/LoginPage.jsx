import { Card, Container, Row, Col } from 'react-bootstrap';
import LoginImage from '../assets/login-img.jpg';
import { Navigate } from 'react-router';
import Header from '../components/Header';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const signupLink = '/signup';
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
                    src={LoginImage}
                    alt=""
                    className="img-fluid"
                    style={{ borderRadius: '50%' }}
                  />
                </Col>
                <Col md={6}>
                  <Card.Title className="mb-4 text-center fs-1 fw-semibold">
                    Войти
                  </Card.Title>
                  <LoginForm />
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="p-4 text-center fw-medium">
              <span>Нет аккаунта? </span>
              <a href={signupLink}>Регистрация</a>
            </Card.Footer>
          </Card>
        </Container>
      </main>
    </>
  );
};