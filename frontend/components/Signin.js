import { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION(
    $email: String!
    $password: String!
  ) {
    signin(email: $email, password: $password) {
      id
      email
    }
  }
`;

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signin, { error, loading }] = useMutation(
    SIGNIN_MUTATION, 
    { 
      variables: {
       email,
        password
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
        await signin();
        setEmail('');
        setPassword('');
        console.log('Hey fam')
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign in to your account</h2>
        <Error error={error} />
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
        <button type="submit">Sign In</button>
      </fieldset>
    </Form>
  );
};

export default Signin;
