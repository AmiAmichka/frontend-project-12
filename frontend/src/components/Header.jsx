import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

export const Header = () => {
  const navigate = useNavigate();
  const chatLink = '/';
  const authToken = localStorage.getItem('authToken');
  const isAuth = !!authToken;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <Navbar className="bg-white shadow-sm navbar-light navbar-expand-lg fw-medium fs-4">
      <Container>
        <Navbar.Brand href={chatLink}>Hexlet Chat</Navbar.Brand>
        {isAuth && (
          <Button variant="primary" onClick={handleLogout}>
            Выйти
          </Button>
        )}
      </Container>
    </Navbar>
  );
};
