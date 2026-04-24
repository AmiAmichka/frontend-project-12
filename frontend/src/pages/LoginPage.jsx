import { useFormik } from 'formik';
import { Card, Form, Button, FloatingLabel, Alert } from 'react-bootstrap';
import LoginImage from '../assets/login-img.jpg';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router';
import { useState } from 'react';

const LoginPage = () => {
  const authToken =  localStorage.getItem('authToken');
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/api/v1/login', values);
        const authToken = response.data.token;
        localStorage.setItem('authToken', authToken);
        setError(null);
        navigate('/');

      } catch (error) {
        if (error.response?.status === 401) {
          setError('Неверные имя пользователя или пароль')
        } else {
          console.error('Ошибка:', error);
        }
      }
    },
  });
  if (authToken) {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <Card>
      <Card.Body>
        <img src={LoginImage} alt="" />
        <Card.Title>Войти</Card.Title>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <FloatingLabel controlId="username" label="Ваш ник">
              <Form.Control
                id="username"
                name="username"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.username}
                required
                autoFocus
                placeholder="Ваш ник"
                size="lg"
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group>
            <FloatingLabel controlId="password" label="Пароль">
              <Form.Control
                type="password"
                placeholder="Пароль"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                required
                size="lg"
              />
            </FloatingLabel>
          </Form.Group>
          {error && <Alert variant='danger'>{error}</Alert>}
          <Button variant="primary" type="submit">
            Войти
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginPage;
