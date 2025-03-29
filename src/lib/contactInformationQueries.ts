import axios from "axios";

const root = import.meta.env.PROD ? `${import.meta.env.VITE_NODE_JS_PROD_URL}/api` : "http://localhost:5000/api";
export const addContactInformation = async (formData: FormData) => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
      Data: {
        _id: string;
        user_id: number;
        first_name: string;
        last_name: string;
        contact_number: string;
        email_address?: string;
        contact_profile_photo?: string;
      };
    }>(`${root}/contact-information/add-contact-information`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
      Data: response.data.Data,
    };
  } catch (error) {
    console.error("Failed to add contact:", error);
    return { Result: false, Message: "Failed to add contact." };
  }
};

export const getUserContactInformations = async (userId: number) => {
  try {
    const response = await axios.get(
      `${root}/contact-information/user-contacts/${userId}`,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data.contacts;
  } catch (error) {
    console.error("Failed to get contacts:", error);
    return { Result: false, Message: "Failed to get contacts." };
  }
};

export const updateContactInformation = async (formData: FormData) => {
  try {
    const response = await axios.put<{
      Result: boolean;
      Message: string;
      Data: {
        _id: string;
        user_id: number;
        first_name: string;
        last_name: string;
        contact_number: string;
        email_address?: string;
        contact_profile_photo?: string;
      };
    }>(`${root}/contact-information/update-contact-information`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
      Data: response.data.Data,
    };
  } catch (error) {
    console.error("Failed to add contact:", error);
    return { Result: false, Message: "Failed to add contact." };
  }
};

export const deleteContact = async (id: string) => {
  try {
    const response = await axios.delete<{
      Result: boolean;
      Message: string;
    }>(`${root}/contact-information/delete-contact-information`, {
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

export const getSharedContacts = async (userId: number) => {
  try {
    const response = await axios.get(
      `${root}/contact-information/shared-contacts/${userId}`,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data.contacts;
  } catch (error) {
    console.error("Failed to get contacts:", error);
    return { Result: false, Message: "Failed to get contacts." };
  }
};

export const getMySharedContacts = async (userId: number) => {
  try {
    const response = await axios.get(
      `${root}/contact-information/my-shared-contacts/${userId}`,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    return response.data.contacts;
  } catch (error) {
    console.error("Failed to get contacts:", error);
    return { Result: false, Message: "Failed to get contacts." };
  }
};

export const shareContactInformation = async ({
  contactOwnerId,
  contactShareTo,
  contactId,
}: {
  contactOwnerId: number;
  contactShareTo: number;
  contactId: string;
}) => {
  try {
    const response = await axios.post<{
      Result: boolean;
      Message: string;
    }>(`${root}/contact-information/share-contact-information`, {
      contactOwnerId: contactOwnerId,
      contactShareTo: contactShareTo,
      contactId: contactId,
    });
    console.log(response);
    return {
      Result: response.data.Result,
      Message: response.data.Message,
    };
  } catch (error) {
    console.error("Failed to share contact:", error);
    return { Result: false, Message: "Failed to share contact." };
  }
};

export const deleteSharedContact = async (id: number) => {
  try {
    const response = await axios.delete<{
      Result: boolean;
      Message: string;
    }>(`${root}/contact-information/delete-share-contact`, {
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