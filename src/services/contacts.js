import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  userId,
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });
  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};
export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: userId,
  });

  return contact;
};
export const createContact = async (payload, userId, photo) => {
  const contact = await ContactsCollection.create({
    ...payload,
    userId,
    photo,
  });
  return contact;
};

export const updateContact = async (
  userId,
  contactId,
  payload,
  options = {},
) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const updateContactById = async (contactId, userId, payload) => {
  const result = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );

  return result;
};
export const deleteContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
