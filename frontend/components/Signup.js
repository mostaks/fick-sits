import { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './queries/Queries';
import { SIGNUP_MUTATION } from './mutations/Mutations';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [signup, { error, loading }] = useMutation(
    SIGNUP_MUTATION,
    {
      variables: {
        email,
        name,
        password
      },
      refetchQueries: [{ query: CURRENT_USER_QUERY }]
    }
  );

  const saveToState = (e, hook) => {
    const val = e.target.value;
    hook(val);
  }

  return (
    <Form method="post" onSubmit={async e => {
      e.preventDefault();
      await signup();
      setEmail("");
      setName("");
      setPassword("");
    }}>
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign up for an account</h2>
        <Error error={error} />
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={(e) => saveToState(e, setEmail)}
          />
        </label>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder="name"
            value={name}
            onChange={(e) => saveToState(e, setName)}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e) => saveToState(e, setPassword)}
          />
        </label>
        <button type="submit">Sign Up </button>
      </fieldset>
    </Form>
  );
}

export default Signup;
