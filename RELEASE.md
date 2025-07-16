# Release Workflow

This project uses `release-please` to automate the release process.

## How it Works

1.  When a pull request is merged to the `main` branch, the `release-please` workflow runs.
2.  The workflow analyzes the commit messages to determine the next version number.
3.  A release pull request is created with the new version number and a changelog.
4.  When the release pull request is merged, a new GitHub release is created.
5.  The `publish.yml` workflow is triggered by the new release.
6.  The workflow publishes the new versions of the packages to NPM.

## Commit Message Conventions

This project uses the [Conventional Commits](https://www.conventionalcommits.org/) specification. The commit messages are used to automatically generate the changelog and determine the next version number.

-   `feat`: A new feature.
-   `fix`: A bug fix.
-   `docs`: Documentation only changes.
-   `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
-   `refactor`: A code change that neither fixes a bug nor adds a feature.
-   `perf`: A code change that improves performance.
-   `test`: Adding missing tests or correcting existing tests.
-   `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation.
