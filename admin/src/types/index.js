import { shape, number, string, arrayOf, object } from 'prop-types';

export const processorType = shape({
  id: number,
  name: string,
  description: string,
  logoUrl: string,
  scopes: arrayOf(string),
  address: string
});

export const userType = shape({
  id: number,
  username: string
});

export const rectificationDetailsType = shape({
  id: number,
  currentData: object,
  updates: object,
  createdAt: string,
  status: string
});
