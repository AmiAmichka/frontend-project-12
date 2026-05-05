import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
import { Header } from '../components/Header';
import { useFormik } from 'formik';

const authToken = localStorage.getItem('authToken');
const config = {
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
};

export const ChatPage = () => {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseChannels = await axios.get('/api/v1/channels', config);
        const responseMessages = await axios.get('/api/v1/messages', config);

        setChannels(responseChannels.data);
        setMessages(responseMessages.data);
        setActiveChannelId(responseChannels.data[0].id);
      } catch (error) {
        console.error('Ошибка:', error);
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
      try {
        const response = await axios.post(
          '/api/v1/messages',
          {
            body: values.currentMessage,
            channelId: activeChannelId,
          },
          config,
        );
        setMessages([...messages, response.data]);
        resetForm();
      } catch (error) {
        console.error('Ошибка:', error);
      }
    },
  });

  return (
    <>
      <Header />
      <main className="flex-grow-1 bg-light py-4">
        <Container className="h-100">
          <Row className="justify-content-center h-100">
            <Col xxl={10} xl={11} className="h-100">
              <div className="h-100 bg-white rounded shadow overflow-hidden">
                <Row className="h-100 g-0">
                  <Col
                    md={4}
                    lg={3}
                    className="h-100 border-end bg-light-subtle"
                  >
                    <div className="d-flex flex-column h-100">
                      <div className="d-flex justify-content-between align-items-center px-3 py-4 border-bottom bg-white">
                        <b>Каналы</b>
                        <span className="text-muted">{channels.length}</span>
                      </div>
                      <ListGroup
                        variant="flush"
                        className="overflow-auto rounded-0"
                      >
                        {channels.map((channel) => (
                          <ListGroup.Item
                            action
                            active={channel.id === activeChannelId}
                            key={channel.id}
                            className="border-0 rounded-0 px-3 py-2"
                            onClick={() => setActiveChannelId(channel.id)}
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
                  <Col md={8} lg={9} className="h-100">
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
                      <div className="flex-grow-1 overflow-auto px-4 py-3">
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
                              aria-label="Новое сообщение"
                              placeholder="Введите сообщение..."
                              name="currentMessage"
                              type="text"
                              onChange={formik.handleChange}
                              value={formik.values.currentMessage}
                              autoFocus
                              autoComplete="off"
                            />
                            <Button variant="primary" type="submit">
                              Отправить
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
    </>
  );
};
