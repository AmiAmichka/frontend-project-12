import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Spinner,
  Modal,
} from 'react-bootstrap';
import { Header } from '../components/Header';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  addChannel,
  addMessage,
  setActiveChannelId,
  setChannels,
  setMessages,
} from '../store/chatSlice';
import * as yup from 'yup';

export const ChatPage = () => {
  const messageInputRef = useRef(null);

  const authToken = localStorage.getItem('authToken');

  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  const dispatch = useDispatch();
  const channels = useSelector((state) => state.chat.channels);
  const messages = useSelector((state) => state.chat.messages);
  const activeChannelId = useSelector((state) => state.chat.activeChannelId);

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isAddChannelModalShown, setIsAddChannelModalShown] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  const channelNames = channels.map((channel) => channel.name)

  const validationSchema = yup.object({
    channelName: yup
      .string()
      .trim()
      .required('Обязательное поле')
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .notOneOf(channelNames, 'Должно быть уникальным'),
  });

  const handleShowAddChannelModal = () => {
    setIsAddChannelModalShown(true);
  };

  const handleCloseAddChannelModal = () => {
    setIsAddChannelModalShown(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setLoadingError(null);
      try {
        const responseChannels = await axios.get('/api/v1/channels', config);
        const responseMessages = await axios.get('/api/v1/messages', config);

        dispatch(setChannels(responseChannels.data));
        dispatch(setMessages(responseMessages.data));
        dispatch(setActiveChannelId(responseChannels.data[0]?.id ?? null));
      } catch (error) {
        console.error('Ошибка:', error);
        setLoadingError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  const activeChannelMessages = messages.filter(
    (message) => message.channelId === activeChannelId,
  );

  const formik = useFormik({
    initialValues: {
      currentMessage: '',
    },
    onSubmit: async (values, { resetForm }) => {
      const trimmedMessage = values.currentMessage.trim();
      const authUsername = localStorage.getItem('username');

      if (trimmedMessage.length === 0) {
        return;
      }
      setIsSending(true);

      try {
        const response = await axios.post(
          '/api/v1/messages',
          {
            username: authUsername,
            body: trimmedMessage,
            channelId: activeChannelId,
          },
          config,
        );
        dispatch(addMessage(response.data));
        resetForm();
      } catch (error) {
        console.error('Не удалось загрузить чат', error);
      } finally {
        setIsSending(false);
      }
    },
  });

  const addChannelFormik = useFormik({
    initialValues: {
      channelName: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const trimmedChannelName = values.channelName.trim();

      try {
        if (trimmedChannelName.length === 0) {
          return;
        }
        const response = await axios.post(
          '/api/v1/channels',
          { name: trimmedChannelName },
          config,
        );
        dispatch(addChannel(response.data));
        dispatch(setActiveChannelId(response.data.id));
        resetForm();
        handleCloseAddChannelModal();
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    if (!isSending && !isLoading) {
      messageInputRef.current?.focus();
    }
  }, [isSending, isLoading]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="d-flex flex-grow-1 align-items-center justify-content-center">
          <Container className="h-100">
            <div className="d-flex flex-column align-items-center">
              <Spinner animation="border" variant="primary"></Spinner>
              <p className="text-center mb-0">Загрузка чата...</p>
            </div>
          </Container>
        </main>
      </>
    );
  }

  if (loadingError) {
    return <div>Ошибка: {loadingError}</div>;
  }

  const isMessageEmpty = formik.values.currentMessage.trim();

  return (
    <>
      <Header />
      <main className="flex-grow-1 bg-light py-4 overflow-hidden">
        <Container className="h-100">
          <Row className="justify-content-center h-100">
            <Col xxl={10} xl={11} className="h-100">
              <div className="h-100 bg-white rounded shadow overflow-hidden">
                <Row className="h-100 g-0">
                  <Col md={4} lg={3} className="h-100 border-end bg-white">
                    <div className="d-flex flex-column h-100">
                      <div className="d-flex justify-content-between align-items-center px-3 py-4 border-bottom bg-white">
                        <b>Каналы</b>
                        <Button
                          variant="outline-primary"
                          className="rounded-1 d-flex align-items-center justify-content-center p-0"
                          type="button"
                          style={{ width: '20px', height: '20px' }}
                          aria-label="Добавить канал"
                          onClick={handleShowAddChannelModal}
                        >
                          +
                        </Button>
                      </div>
                      <ListGroup
                        variant="flush"
                        className="flex-grow-1 overflow-auto rounded-0"
                      >
                        {channels.map((channel) => (
                          <ListGroup.Item
                            action
                            active={channel.id === activeChannelId}
                            key={channel.id}
                            className="border-0 rounded-0 px-3 py-2"
                            onClick={() =>
                              dispatch(setActiveChannelId(channel.id))
                            }
                            variant={
                              channel.id === activeChannelId ? 'dark' : 'light'
                            }
                          >
                            # {channel.name}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  </Col>
                  <Col md={8} lg={9} className="h-100 bg-white">
                    <div className="d-flex flex-column h-100">
                      <div className="border-bottom px-4 py-4">
                        <p className="mb-1">
                          <b>
                            #{' '}
                            {
                              channels.find(
                                (channel) => channel.id === activeChannelId,
                              )?.name
                            }
                          </b>
                        </p>
                        <span className="text-muted small">
                          {activeChannelMessages.length} сообщений
                        </span>
                      </div>
                      <div className="flex-grow-1 overflow-auto px-4 py-3 min-h-0">
                        <ul className="list-unstyled mb-0">
                          {activeChannelMessages.map((message) => (
                            <li key={message.id} className="mb-2">
                              <b>{message.username}</b>
                              {`: ${message.body}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-top px-4 py-3 bg-white">
                        <Form onSubmit={formik.handleSubmit}>
                          <div className="input-group">
                            <Form.Control
                              disabled={isSending}
                              aria-label="Новое сообщение"
                              placeholder="Введите сообщение..."
                              name="currentMessage"
                              type="text"
                              onChange={formik.handleChange}
                              value={formik.values.currentMessage}
                              autoFocus
                              autoComplete="off"
                              ref={messageInputRef}
                            />
                            <Button
                              variant="outline-secondary"
                              type="submit"
                              disabled={
                                isSending || isMessageEmpty.length === 0
                              }
                              aria-label="Отправить"
                            >
                              →
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
      <Modal
        show={isAddChannelModalShown}
        onHide={handleCloseAddChannelModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Добавить канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addChannelFormik.handleSubmit}>
            <div className="input-group">
              <Form.Control
                name="channelName"
                onChange={addChannelFormik.handleChange}
                value={addChannelFormik.values.channelName}
                onBlur={addChannelFormik.handleBlur}
                autoFocus
                isInvalid={Boolean(
                  addChannelFormik.touched.channelName &&
                  addChannelFormik.errors.channelName,
                )}
              />
              <Form.Control.Feedback type="invalid">
                {addChannelFormik.errors.channelName}
              </Form.Control.Feedback>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddChannelModal}>
                Отменить
              </Button>
              <Button variant="primary" type="submit">
                Отправить
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
