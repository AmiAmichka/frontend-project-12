import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';

export const LoginForm = () => {
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
        const token = response.data.token;
        const authUsername = values.username;
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', authUsername);
        setError(null);
        navigate('/');
      } catch (error) {
        if (error.response?.status === 401) {
          setError('Неверные имя пользователя или пароль');
        } else {
          console.error('Ошибка:', error);
        }
      }
    },
  });
  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group className="mb-3">
        <FloatingLabel controlId="username" label="Ваш ник">
          <Form.Control
            name="username"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            required
            autoFocus
            placeholder="Ваш ник"
            size="lg"
            isInvalid={Boolean(error)}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel controlId="password" label="Пароль">
          <Form.Control
            type="password"
            placeholder="Пароль"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            required
            size="lg"
            isInvalid={Boolean(error)}
          />
        </FloatingLabel>
        {error && (
          <div className="bg-danger text-white rounded mt-2 px-3 py-2 fw-medium">
            {error}
          </div>
        )}
      </Form.Group>
      <Button
        variant="outline-primary"
        type="submit"
        className="w-100 fw-medium"
      >
        Войти
      </Button>
    </Form>
  );
};
