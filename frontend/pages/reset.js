import Reset from '../components/Reset';

const ResetPage = ({ query: { resetToken } }) => {
  return (
    <>
      <p>Reset your password {resetToken}</p>
      <Reset resetToken={resetToken} />
    </>
  )
}

export default ResetPage
