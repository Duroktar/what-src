# Contributing to What-Src

 - [Commit Message Guidelines](#commit)

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted.
This leads to **more readable messages** that are easy to follow when looking
through the **project history**.  But also, we use the git commit messages to
**generate the Angular change log**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**.  The
header has a special format that includes a **type**, a **scope** and a
**subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the
message to be easier to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an
issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if
any.

```
docs(changelog): update changelog to beta.5
```
```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

### Revert

If the commit reverts a previous commit, it should begin with `revert: `,
followed by the header of the reverted commit. In the body it should say: `This
reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

* **build**: Changes that affect the build system or external dependencies
  (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes:
  Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space,
  formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests

### Scope
The scope should be the name of the npm package affected (as perceived by the
person reading the changelog generated from commit messages.

The following is the list of supported scopes:

* **plugin**
* **babel-plugin**
* **webpack-plugin**
* **stats-frontend**
* **express-server**
* **express-middleware**
* **example-***
* **utils**

There are currently a few exceptions to the "use package name" rule:

* **packaging**: used for changes that change the npm package layout in all of
  our packages, e.g. public path changes, package.json changes done to all
  packages, d.ts file/format changes, changes to bundles, etc.
* **changelog**: used for updating the release notes in CHANGELOG.md
* **gh-pages**: used for updates to the website bundle in the /docs directory of
  the repo
* none/empty string: useful for `style`, `test` and `refactor` changes that are
  done across all packages (e.g. `style: add missing semicolons`) and for docs
  changes that are not related to a specific package (e.g. `docs: fix typo in
  tutorial`).

### Subject
The subject contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not
"changed" nor "changes". The body should include the motivation for the change
and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes** and is also
the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space
or two newlines. The rest of the commit message is then used for this.

A detailed explanation can be found in this [document][commit-message-format].

# Inspiration

This guide was heavily inspired by the on found at
[Angular](https://github.com/angular/angular/blob/master/CONTRIBUTING.md)