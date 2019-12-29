import { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';
import PropTypes from 'prop-types';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './queries';
import { RESET_MUTATION } from './mutations';

const Reset = ({ resetToken }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [reset, { error, loading }] = useMutation(
    RESET_MUTATION,
    {
      variables: {
        resetToken,
        password,
        confirmPassword
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }]
    }
  );

  const saveToState = (e, hook) => {
    const val = e.target.value;
    hook(val);
  };

  return (
    <Form
      method="post"
      onSubmit={async e => {
        e.preventDefault();
        await reset();
        setPassword('');
        setConfirmPassword('');
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Hurry up and reset your password before i change my mind</h2>
        <Error error={error} />
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={e => saveToState(e, setPassword)}
          />
        </label>
        <label htmlFor="confirmPassword">
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            placeholder="confirmPassword"
            value={confirmPassword}
            onChange={e => saveToState(e, setConfirmPassword)}
          />
        </label>
        <button type="submit">Send it</button>
      </fieldset>
    </Form>
  );
};

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired
};

export default Reset;
