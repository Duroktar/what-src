# @what-src/stats-frontend

Powered by Typescript. Using React, @emotion and @rebass w/ i18next translations

<p align="center">
  <a href="https://duroktar.github.io/what-src/">
    <img alt="what-src" src="https://raw.githubusercontent.com/Duroktar/what-src-logo/master/screenshots/what-src-stats-screenshot.png" width="760"></img>
  </a>
</p>

# Usage

To make clicks from your projects count, first make sure `@what-src/plugin` is
installed and configured with the required `flag` enabled (read more
[here](https://github.com/Duroktar/what-src/tree/master/packages/what-src-plugin-babel#--enableXkcdMode-boolean)).

Once properly setup, all captured clicks from the plugin will be sent to our
servers ([anonymously](#privacy)) and counted towards the total score on the
website.

## Example

[See the app](https://duroktar.github.io/what-src/) itself which has
`@what-src/plugin` running in
[productionMode](https://github.com/Duroktar/what-src/tree/master/packages/what-src-plugin-babel#--productionmode-boolean)
with the
[useRemote](https://github.com/Duroktar/what-src/tree/master/packages/what-src-plugin-babel#--useremote-boolean)
and
[enableXkcdMode](https://github.com/Duroktar/what-src/tree/master/packages/what-src-plugin-babel#--enableXkcdMode-boolean)
flags enabled. How's that for meta?

# Development

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run
scripts via `npm`. However, it is recommended to setup the entire `what-src`
repository with the `lerna bootstrap` command from the main project directory.

> NOTE: If this is the first time running the code on your machine you will have
> to run `npm run build` from the root directory as well.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies (prefer running `lerna bootstrap` cmd in root directory instead) |
| `npm start` | Build project and open web server running project (`production` mode) |
| `npm run start:dev` | Runs the development server w/ live reloading, etc.. (`development` mode) |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc.. `production` mode) |
| `npm run serve` | Serves the current build from the `public` folder (`production` mode) |

## Writing Code

After starting the development server with `npm start:dev`, you can edit any
files in the `src` folder and webpack will automatically recompile and reload
your server (available at `http://localhost:9000` by default).

# Deployment (docs/)

### Build, Copy, and deploy

To build and deploy the site, simply run the `build:docs` command from the root
`package.json` file (ie: from the root project directory, not this directory).
That will take care of building all the latest packages before recompiling a new
version of the site which is copied to the root `docs/` directory which can be
served on `gh-pages` once pushed to `master`.

> NOTE: The new build must be pushed to github _manually_ from either the cli or
> a git client.

### Build only

After you run the `npm run build` command (the one in this directory), your code
will be built into a single bundle located at `public/bundle.min.js` along with
any other assets your project depends on (`index.html`, licenses, etc..).

# Privacy

`@what-src/plugin` with
[enableXkcdMode](https://github.com/Duroktar/what-src/tree/master/packages/what-src-plugin-babel#--enableXkcdMode-boolean)
enabled sends no user data to the tracking server and merely inserts a new row
to the table with a timestamp of the moment it was created. That's it.

# License

[MIT](https://opensource.org/licenses/MIT)
