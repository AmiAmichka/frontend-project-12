import { Navbar, Container } from "react-bootstrap"

export const Header = () => {
  const chatLink = '/';

  return (
    <Navbar className="bg-white shadow-sm navbar-light navbar-expand-lg fw-medium fs-4">
      <Container>
        <Navbar.Brand href={chatLink}>Hexlet Chat</Navbar.Brand>
      </Container>
    </Navbar>
  )
}