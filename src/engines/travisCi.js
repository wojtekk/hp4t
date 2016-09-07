function getBranch() {
  return process.env.TRAVIS_BRANCH;
}

function getTag() {
  return process.env.TRAVIS_TAG;
}

function isTag() {
  return process.env.TRAVIS_TAG !== '';
}

function getSlug() {
  return process.env.TRAVIS_REPO_SLUG;
}

function isPullRequest() {
  return process.env.TRAVIS_PULL_REQUEST === 'true';
}

module.exports = () => {
  const exports = {
    getBranch,
    getTag,
    getSlug,
    isPullRequest,
    isTag,
  };

  return exports;
};
