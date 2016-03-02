# 1.0.1 - 2016-03-02

* Update Lodash to 4.x.

# 1.0.0 - 2016-01-01

## Breaking changes

### Distinct classes for hanging quote types

0.1.8:

| Character | Spacer class | Character class |
| --------- | ------------ | --------------- |
| `“` | `.slaquo` | `.hlaquo` |
| `‘` | `.slaquo` | `.hlaquo` |
| `«` | `.slaquo` | `.hlaquo` |
| `„` | `.sbaquo` | `.hbaquo` |
| `(` | `.sbrace` | `.hbrace` |

1.0.0:

| Character | Spacer class | Character class |
| --------- | ------------ | --------------- |
| `“` | **`.sldquo`** | **`.hldquo`** |
| `‘` | **`.slsquo`** | **`.hlsquo`** |
| `«` | `.slaquo` | `.hlaquo` |
| `„` | **`.sbdquo`** | **`.hbdquo`** |
| `(` | `.sbrace` | `.hbrace` |

You can copy-paste a base CSS [from the readme](https://github.com/sapegin/richtypo.js#styles).

Thanks to @bobthecow.

### Other breaking changes

* Drop Node 0.8 support.

## Improvements

* Replace spaces around em-dash with hair spaces in English (#16).
* Support for IE conditional comments (#19, by @bobthecow).

## Fixes

* Non-breaking spaces after short words (#6).
* Hanging punctuation after HTML tag.
* Line breaks should not be treated as spaces (also fixes #17).

## Also

An example [page on gh-pages](http://sapegin.github.io/richtypo.js/) and [a playground on Tonic](https://tonicdev.com/npm/richtypo).

# 0.1.8 - 2013-08-23

Maintenance release.

# 0.1.6 - 2013-04-25

* Fix hanging punctuation.

# 0.1.5 - 2013-01-24

* New API methods: full() and textify().
* Fix rules loading when lang() method not invoked.
* CLI.
