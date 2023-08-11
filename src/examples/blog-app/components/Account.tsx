import React from 'react';
import { Box, useDispatch, useSelector } from 'amos';

// Define the initial state for the accountBox
const initialState = {
  id: '',
  name: '',
  blogs: [],
};

// Define the accountBox
const accountBox = new Box('account', initialState);

// Define actions and mutations for the accountBox
const createAccount = accountBox.mutation((state, account) => ({ ...state, ...account }));
const updateAccount = accountBox.mutation((state, account) => ({ ...state, ...account }));
const deleteAccount = accountBox.mutation(() => initialState);

// Define the Account component
const Account = () => {
  const dispatch = useDispatch();
  const [account] = useSelector(accountBox);

  const handleCreateAccount = (account) => {
    dispatch(createAccount(account));
  };

  const handleUpdateAccount = (account) => {
    dispatch(updateAccount(account));
  };

  const handleDeleteAccount = () => {
    dispatch(deleteAccount());
  };

  return (
    <div>
      <h2>{account.name}</h2>
      <button onClick={handleCreateAccount}>Create Account</button>
      <button onClick={handleUpdateAccount}>Update Account</button>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export
