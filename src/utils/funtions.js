import moment from 'moment/moment';
export const encriptObj = (o) => {
  let salt =
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout';
  o = JSON.stringify(o).split('');
  for (var i = 0, l = o.length; i < l; i++)
    if (o[i] == '{') o[i] = '}';
    else if (o[i] == '}') o[i] = '{';
  return encodeURI(salt + o.join(''));
};
export const decryptObj = (o) => {
  let salt =
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout';
  o = decodeURI(o);
  if (salt && o.indexOf(salt) != 0) throw new Error('object cannot be decrypted');
  o = o.substring(salt.length).split('');
  for (var i = 0, l = o.length; i < l; i++)
    if (o[i] == '{') o[i] = '}';
    else if (o[i] == '}') o[i] = '{';
  return JSON.parse(o.join(''));
};
export const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
};
export const dateformat = (date, format) => {
  return moment(date).format(format);
};
export const downloadfile = (res) => {
  // const items = res.data;
  const blob = new Blob([res.data], {
    type: res.headers['content-type']
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
