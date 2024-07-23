export default (clientErrors: { error: string; field?: string }[]) => ({
  response: {
    data: {
      code: 'GenericError',
      msg: 'Client-side error',
      clientErrors
    },
    status: 400,
    statusText: '',
    headers: {},
    config: {}
  }
});
