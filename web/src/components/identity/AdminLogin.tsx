import {
  FormControl,
  TextField,
  Container,
  Stack,
  Paper,
} from '@mui/material'
import { useState } from 'react'
import { adminLogin } from '@apis/adminLogin'
import { useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const doLogin = () => {
    setLoading(true)
    adminLogin(email, password).then(() => {
      setLoading(false)
      navigate('/', { replace: true })
    }).catch(() => {
      alert('Failed to login')
      setLoading(false)
    })
  }
  return (
    <Container maxWidth='md'>
      <Paper
        elevation={1}
        sx={{
          padding: 2,
          marginTop: 2,
          width: '100%',
        }}
      >
        <Stack spacing={2}>
          <FormControl fullWidth>
            <TextField
              label='Email'
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              type='password'
              label='Password'
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </FormControl>
          <LoadingButton loading={loading} variant='contained' fullWidth onClick={doLogin}>
            Log In
          </LoadingButton>
        </Stack>
      </Paper>
    </Container>
  )
}
