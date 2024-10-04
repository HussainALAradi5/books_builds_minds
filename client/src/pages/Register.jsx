import Form from '../components/Form'
const Register = ({ onSuccess }) => {
  return (
    <div>
      <Form isRegister onSuccess={onSuccess} />
    </div>
  )
}

export default Register
