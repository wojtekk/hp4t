function getCommand(name) {
  /* eslint-disable-next-line global-require */
  return require(`./commands/${name}`)();
}

module.exports = () => {
  const exports = {
    getCommand,
  };
  return exports;
}
