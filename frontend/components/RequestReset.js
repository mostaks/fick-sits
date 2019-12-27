import { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { REQUEST_RESET_MUTATION } from './mutations/Mutations';

const RequestReset = () => {
  const [email, setEmail] = useState("");

  const [reset, { error, loading, called }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: {
        email
      }
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
        setEmail('');
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>You forgot your password again didn't you?</h2>
        <h3>You're lucky I'm a good bloke</h3>
        <Error error={error} />
        {!error && !loading && called && <p>Check your email for a reset link</p>}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={e => saveToState(e, setEmail)}
          />
        </label>
        <button type="submit">Request reset</button>
      </fieldset>
    </Form>
  );
};

export default RequestReset;
