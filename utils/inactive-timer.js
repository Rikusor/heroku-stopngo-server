module.exports = (time) => {
  const currentDate = new Date();
  return new Date(currentDate.getTime() - (1000 * 60 * Number(time)));
};
