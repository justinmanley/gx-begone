gx-begone
=========

Convert Google's proprietary gx-prefixed KML format (output by [My Tracks](https://play.google.com/store/apps/details?id=com.google.android.maps.mytracks&hl=en)) to standard KML.


Usage
===========
Both of these conversion solutions use the [`xsltproc`](http://xmlsoft.org/XSLT/xsltproc2.html) command-line xslt-processing tool.  Depending on how nice you want the output to be, you may also want [`xmllint`](http://xmlsoft.org/xmllint.html) or [json](https://github.com/trentm/json) for [NodeJS](http://nodejs.org/).

### gx:KML &#8594; KML ###

To turn `my.kml` into `my_better.kml`:

```bash
xsltproc gx-begone.xslt /path/to/my.kml | xmllint --format - > my_better.kml
```

The command-line tool `xmllint` is used to make the output nicer, but you can leave it off if you don't care about that.

### gx:KML &#8594; GeoJSON ###

To turn `my.kml` into `my.geojson`, run the following commands from the root directory of this repo:

```bash
npm install                # install json nodejs tool
xsltproc gx-to-geojson.xslt /path/to/my.kml | nodejs ./node_modules/.bin/json > my.json
```
The [`json`](https://github.com/trentm/json) command line tool is used to prettify the json output of `gx-to-geojson.xslt`.

Note that you will need [NodeJS](http://nodejs.org/) installed on your system to use the above json prettifier.

Ta da!  Now you can view your GeoJSON or KML in [QGIS](http://www.qgis.org/en/site/) or transform it into other formats using [ogr2ogr](http://www.gdal.org/ogr2ogr.html).

The Problem
===========

Google introduced [KML](http://en.wikipedia.org/wiki/Keyhole_Markup_Language) several years ago to store data for display in Google Earth and Google Maps.  Since it was adapted as an international standard by the [Open Geospatial Consortium (OGC) in 2008](http://www.opengeospatial.org/standards/kml), lots of open tools have been developed for viewing KML and converting it to other popular formats.  In particular, the conversion tool [ogr2ogr](http://www.gdal.org/ogr2ogr.html) can convert standard KML to a wide range of other formats.

However, with [Google Earth 5.0](https://support.google.com/earth/answer/40901?hl=en), [released in 2009/2010](http://en.wikipedia.org/wiki/Google_Earth#Versions_and_variations), Google introduced a [new `"gx"` namespace](https://developers.google.com/kml/documentation/kmlreference#kmlextensions) not part of the OGC standard.

Google Earth saves KML documents using elements from this new `"gx"` namespace, as does Google's [My Tracks Android application](https://play.google.com/store/apps/details?id=com.google.android.maps.mytracks&hl=en).  As of July 2014, Google's extended namespace is not supported by other open tools, so these files can *only* be opened in Google Earth and Google Maps.

What a pain.

The Solution
============

This repository provides two `xslt` files for transforming Google-prefixed KML produced by My Tracks to standard KML and GeoJSON.  Be warned: this conversion *is* lossy: the KML files output by My Tracks include timestamp data and velocity data that standard KML does not yet have a good way of recording.

Conversion loss:
    * `gx:KML -> KML` converter *only* extracts the path (it loses the timestamps and velocity data)
    * `gx:KML -> GeoJSON` converter extracts path and timestamps (it places the timestamps in an array in the `"properties"` object of the "GeoJSON Feature", and loses the velocity data.)

If you need this data, send me a message asking me to include this in the conversion, or submit a pull request.

Javascript Converter
============

I spent some time working on a Javascript converter using [`xmldom`](https://github.com/jindw/xmldom) and [`xpath`](https://github.com/goto100/xpath).  I put that aside in favor of the quicker `xslt`-based approach, but if you're interested, you can view the code in the [`javascript` branch](https://github.com/manleyjster/gx-begone/tree/javascript) in this repo.