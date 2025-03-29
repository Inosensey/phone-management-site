import axios from "axios";

const root = import.meta.env.PROD ? `${import.meta.env.VITE_NODE_JS_PROD_URL}/api` : "http://localhost:5000/api";

// Types
type userInfoType = {
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  roleId?: number;
};
type forgotPassword = {
  email?: string;
  code?: number;
  forgotPassword?: string;
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${root}/user`, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAccountRequest = async () => {
  try {
    const response = await axios.get(`${root}/user/account-request`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const approveAccount = async (id: number) => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
      user: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        role_id: number;
        role_name: string;
        status_id?: number;
        status_name?: string;
      };
    }>(`${root}/user/approve-account`, {
      id: id,
    });
    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
      user: response.data.user,
    };
  } catch (error) {
    console.log(error);
  }
};

export const activateAccount = async (id: number) => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
    }>(`${root}/user/activate-account`, {
      id: id,
    });
    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
    };
  } catch (error) {
    console.log(error);
  }
};

export const deactivateAccount = async (id: number) => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
    }>(`${root}/user/deactivate-account`, {
      id: id,
    });
    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
    };
  } catch (error) {
    console.log(error);
  }
};

export const updateAccount = async ({
  id,
  email,
  username,
  firstName,
  lastName,
}: {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}) => {
  try {
    const response = await axios.put<{
      Result: boolean;
      Message: string;
    }>(`${root}/user/update-user`, {
      id: id,
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
    });
    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
    };
  } catch (error) {
    console.log(error);
  }
};

export const deleteAccount = async (id: number) => {
  try {
    const response = await axios.delete<{
      Result: boolean;
      Message: string;
    }>(`${root}/user/delete-user`, {
      data: { id },
    });
    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
    };
  } catch (error) {
    console.log(error);
  }
};

export const addUserThroughAdmin = async ({
  email,
  username,
  firstName,
  lastName,
}: {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}) => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
      user: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        role_id: number;
        role_name: string;
        status_id?: number;
        status_name?: string;
      };
    }>(`${root}/user/add-user`, {
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
    });
    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
      user: response.data.user,
    };
  } catch (error) {
    console.log(error);
  }
};

export const registerUser = async ({
  username,
  email,
  firstName,
  lastName,
  password,
  roleId,
}: userInfoType) => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
    }>(`${root}/user/register-user`, {
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      roleId: roleId,
    });
    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
    };
  } catch (error) {
    console.log(error);
  }
};

export const userSignIn = async ({ email, password }: userInfoType) => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
      Token?: string;
      userId: string;
      roleId: string;
    }>(`${root}/user/sign-in`, {
      email: email,
      password: password,
    });
    return {
      Result: response.data.Result,
      Message: response.data.Message,
      Token: response.data.Token,
      userId: response.data.userId,
      roleId: response.data.roleId,
    };
  } catch (error) {
    console.log(error);
  }
};

export const userSignOut = async () => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
    }>(
      `${root}/user/sign-out`,
      {},
      {
        withCredentials: true,
      }
    );
    return {
      Result: response.data.Result,
      Message: response.data.Message,
    };
  } catch (error) {
    console.log(error);
  }
};

export const forgotPasswordRequest = async ({
  email,
  code,
}: forgotPassword) => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
    }>(`${root}/user/forgot-password`, {
      email: email,
      code: code,
    });
    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
    };
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async ({ email, password }: userInfoType) => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
    }>(`${root}/user/change-password`, {
      email: email,
      password: password,
    });
    return {
      Result: response.data.Result,
      Message: response.data.Message,
    };
  } catch (error) {
    console.log(error);
  }
};
