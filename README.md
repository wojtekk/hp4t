# HP4T

## Usage

Usage:

    hp4t <command> [options]

Commands:

- `provision <app_name>` - provision app_name
- `pipeline` - provision pipeline
- `deploy <app_name>` - deploy to app_name
- `promote <app_name>` - promote from app
- `run <command>` - run command on Heroku
- `local <command>` - run command locally
- `setup` - initialize project
- `export <app_name>` - export Heroku app configuration

Options:

- `--branch <branch_name>` - deploy only from a specific branch
- `--tags` - deploy only from tags
- `--slug <slug_name>` - deploy only from specific repository slug

## Configuration

File: `.hp4t.yaml`, format YAML.

Example:

    deployment:
    - slug: wojtekk/hp4t
    - branch: master
    infrastructure:
    - dir: infrastructure/

