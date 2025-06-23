import { ContactCollection } from '../db/models/Contact.js';

export const getContact = async () => {
  const contact = await ContactCollection.find();
  return contact;
};
export const getContactById = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);

  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};

export const deleteContactById = async (contactId) => {
  const contact = await ContactCollection.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};

export const updateContactById = async (contactId, payload) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
    },
  );

  return rawResult;
};
