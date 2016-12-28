# TheKeyGame

TheKeyGame is a project game made in JQuery created by [Slinkybass](http://www.garaballu.com).

To get started, check out the Documentation

## Table of contents

- [How to play](#how-to-play)
- [Quick start](#quick-start)
- [Create the levels](#create-the-data)
- [Creators](#creators)
- [Copyright and license](#copyright-and-license)

## How to play
It's simple, a falling key, a chest and a variable that should be the same. But you only have arrows...

## Quick start

To install TheKeyGame just [download the latest release](https://github.com/slinkybass/thekeygame/archive/master.zip) and play.
This game allowed to modify all the levels and include more.

The package NEEDS [jQuery](https://github.com/jquery/jquery) but is ready to run because CDN links are included in index.html.


## Create the levels

First of all, you'll need to create a JSON file. This JSON will contain all the info about your levels.

Lets see an example:

```json
# levels.json
{
    "levels": [
        {
            "size_x": "1",
            "size_y": "3",
            "var": "0",
            "cols": [
                {
                    "position": {
                        "x": 0,
                        "y": 0
                    },
                    "elements": {
                        "start": true
                    }
                },
                {
                    "position": {
                        "x": 0,
                        "y": 1
                    }
                },
                {
                    "position": {
                        "x": 0,
                        "y": 2
                    },
                    "elements": {
                        "end": true
                    },
                    "actions": {
                        "check": 0
                    }
                }
            ]
        }
```


## Creators

**Garaballú (slinkybass)**

- <https://twitter.com/slinkybass>
- <https://github.com/slinkybass>


## Copyright and license

Code and documentation Copyright 2016. [TheKeyGame Authors](https://github.com/slinkybass/thekeygame/graphs/contributors) and [Garaballú](http://www.garaballu.com).

Code released under the [MIT License](https://github.com/slinkybass/thekeygame/blob/master/LICENSE).