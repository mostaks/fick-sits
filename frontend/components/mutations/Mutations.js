import gql from 'graphql-tag';

export const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

export const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION(
    $email: String!
  ) {
    requestReset(email: $email) {
      message
    }
  }
`;

export const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!,
    $password: String!,
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken, 
      password: $password, 
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

export const SIGNIN_MUTATION = gql`
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

export const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermission(
    $permissions: [Permission], 
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;