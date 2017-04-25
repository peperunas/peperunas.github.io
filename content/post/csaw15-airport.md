+++
date = "2015-09-23T16:56:59+02:00"
highlight = true
math = false
tags = ["forensics", "write-up"]
title = "CSAW 2015 - Airport"

[header]
  caption = ""
  image = ""

+++

In this challenge we were provided with 5 images:<!--more-->

    ├── 1.png
    ├── 2.png
    ├── 3.png
    ├── 4.png
    └── steghide.jpg

The folder listing was a strong hint nevertheless: our objective was to extract something from `steghide.jpg`  but first we had to get the proper passphrase for it.

# How?
Each image shown a different airport: the first thing to do was recognizing each one. We mainly used [TinEye](https://www.tineye.com/) and [Image Raider](https://www.imageraider.com/).
After uploading each image, we were able to name the first, second and fourth airport while the third one wasn't found on those search engines.

    1.png -> Jose Marti
    2.png -> Hong Kong
    4.png -> Pearson

To get the third one, we searched the web for the main roads near the airport, in order to get some helpful information: this resulted in finding the airport name in just a few minutes.

    3.png -> Los Angeles

# What about the key?

Once we had pinned down each airport, it was trivial to think that the key would be the concatenation of each airport's IATA code or name (following the image numbering).
The first try gave us the following string which we used as possible key for `steghide.jpg`: `HAVHKGLAXYYZ`.

# May I haz flag?

    $ > steghide extract -sf steghide.jpg
    Enter passphrase:
    wrote extracted data to "key.txt".
    $ > cat key.txt
    iH4t3A1rp0rt5%
