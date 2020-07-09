export default ({ method, token, params }) => {
  const url = new URLSearchParams();
  Object.keys(params).map(param => url.append(param, params[param]));

  return `https://api.vk.com/method/${method}?${url.toString()}&access_token=${token}&v=5.120`;
};
