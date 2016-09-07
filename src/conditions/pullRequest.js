module.exports = () => {
  function check(pullRequest) {
    return pullRequest === false;
  }

  return {
    check,
  };
};
