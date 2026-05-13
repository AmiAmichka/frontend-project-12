import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';
import * as yup from 'yup';

export const SignupForm = () => {
  const validationSchema = yup.object({
    username: yup
      .string()
      .required('Обязательное поле')
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов'),
    password: yup
      .string()
      .required('Обязательное поле')
      .min(6, 'Не менее 6 символов'),
    passwordConfirm: yup
      .string()
      .required('Обязательное поле')
      .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const userData = {
        username: values.username,
        password: values.password,
      };
      try {
        const response = await axios.post('/api/v1/signup', userData);
        const token = response.data.token;
        const authUsername = values.username;
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', authUsername);
        setError(null);
        navigate('/');
      } catch (error) {
        if (error.response?.status === 409) {
          setError('Такой пользователь уже существует');
        } else {
          console.error('Ошибка:', error);
        }
      }
    },
  });
  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group className="mb-3">
        <FloatingLabel controlId="username" label="Имя пользователя">
          <Form.Control
            name="username"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            required
            autoFocus
            placeholder="Имя пользователя"
            size="lg"
            onBlur={formik.handleBlur}
            isInvalid={Boolean(
              formik.touched.username && formik.errors.username,
            )}
          />
        </FloatingLabel>
        {formik.touched.username && formik.errors.username && (
          <div className="text-danger mt-2 fw-medium">
            {formik.errors.username}
          </div>
        )}
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
            onBlur={formik.handleBlur}
            isInvalid={Boolean(
              formik.touched.password && formik.errors.password,
            )}
          />
        </FloatingLabel>
        {formik.touched.password && formik.errors.password && (
          <div className="text-danger mt-2 fw-medium">
            {formik.errors.password}
          </div>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <FloatingLabel controlId="passwordConfirm" label="Подтвердите пароль">
          <Form.Control
            type="password"
            placeholder="Подтвердите пароль"
            name="passwordConfirm"
            onChange={formik.handleChange}
            value={formik.values.passwordConfirm}
            required
            size="lg"
            onBlur={formik.handleBlur}
            isInvalid={Boolean(
              formik.touched.passwordConfirm && formik.errors.passwordConfirm,
            )}
          />
        </FloatingLabel>
        {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
          <div className="text-danger mt-2 fw-medium">
            {formik.errors.passwordConfirm}
          </div>
        )}
      </Form.Group>
      {error && (
        <div className="bg-danger text-white rounded mt-2 px-3 py-2 fw-medium">
          {error}
        </div>
      )}

      <Button
        variant="outline-primary"
        type="submit"
        className="w-100 fw-medium"
      >
        Зарегистрироваться
      </Button>
    </Form>
  );
};
