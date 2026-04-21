import { useEffect } from 'react'
import axios from 'axios'

function App() {
  useEffect(() => {
    axios.get('/api/v1/channels')
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err))
  }, [])

  return <div>Hello</div>
}

export default App