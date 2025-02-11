export default function addCents(value) {
  if (!value.includes(',')) {
    return value + ',00';
  }

  let parts = value.split(',');
  if (parts[1].length === 1) {
    return value + '0';
  }

  return value;
}
