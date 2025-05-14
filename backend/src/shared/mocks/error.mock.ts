export const errorServiceMock = {
  notFound: jest.fn().mockRejectedValueOnce('Not Found'),
  conflict: jest.fn().mockRejectedValueOnce('Conflict'),
};
