# HP4T

## Usage

Usage:

    hp4t <command> [options]

Commands:

- `help` - display help
- `provision <env_name>` - provision app_name
- `provision-pipeline` - provision pipeline
- `deploy <env_name>` - deploy to app_name
- `promote <env_name>` - promote from app
- `run <env_name> <command>` - run command on Heroku
- `local <command>` - run command locally
- `setup` - initialize project
- `export <env_name>` - export Heroku app configuration

Options:

- `--branch <branch_name>` - deploy only from a specific branch
- `--tags` - deploy only from tags
- `--slug <slug_name>` - deploy only from specific repository slug

### Example `.travis.yml` flow

Trunk base development:

```yaml
language: node_js
node_js:
- 6.0
env:
  global:
  # HEROKU_API_KEY
  - secure: ""
cache:
  apt: true
  directories:
  - node_modules
install:
- npm install
- alias hp4t="$(npm bin)/hp4t"
before_script:
- npm test
- hp4t provision-pipeline
- hp4t provision stage
- hp4t run stage "migrate database"
- hp4t deploy stage
- hp4t provision production
- hp4t promote stage # to production
- hp4t run production "migrate database"
script:
- /bin/true
after_success:
- hp4t notify rollbar
notifications:
- hp4t notify slack
```

With feature branch:

```yaml
language: node_js
node_js:
- 6.0
env:
  global:
  # HEROKU_API_KEY
  - secure: ""
cache:
  apt: true
  directories:
  - node_modules
install:
- npm install
- alias hp4t="$(npm bin)/hp4t"
before_script:
- npm test
- hp4t provision-pipeline
- hp4t provision stage
- hp4t run stage "migrate database"
- hp4t deploy stage
- hp4t provision production
- hp4t promote stage # to production
- hp4t run production "migrate database"
- hp4t deploy featureX --branch featureX
script:
- /bin/true
after_success:
- hp4t notify rollbar
notifications:
- hp4t notify slack
```

Continuous delivery (deploy on tag):

```yaml
language: node_js
node_js:
- 6.0
env:
  global:
  # HEROKU_API_KEY
  - secure: ""
cache:
  apt: true
  directories:
  - node_modules
install:
- npm install
- alias hp4t="$(npm bin)/hp4t"
before_script:
- npm test
- hp4t provision-pipeline
- hp4t provision stage --branch develop
- hp4t run stage "migrate database" --branch develop
- hp4t deploy stage --branch develop
- hp4t provision production --tags --branch master
- hp4t deploy production --tags # to production
- hp4t run production "migrate database" --tags --branch master
- hp4t deploy featureX --branch featureX
script:
- /bin/true
after_success:
- hp4t notify rollbar
notifications:
- hp4t notify slack
```

## Configuration

File: `.hp4t.yaml`, format YAML.

Example:

```yaml
infrastructure:
- dir: infrastructure/
environments:
  defaults:
  - slug: wojtekk/hp4t
  - branch: master
  stage:
  - app: app_name-stage
  - branch: develop
  - tags: false
  production:
  - app: app_name
  - branch: master
  - tags: true
```
