<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="http://www.opengis.net/kml/2.2"
	xmlns:gx="http://www.google.com/kml/ext/2.2">
	<xsl:output method="xml"/>

	<xsl:template match="/">
		<kml xmlns="http://www.opengis.net/kml/2.2">
			<Document>
				<xsl:for-each select="//gx:Track">
					<xsl:call-template name="track"/>
				</xsl:for-each>
			</Document>
		</kml>
	</xsl:template>

	<xsl:template name="track">
		<Placemark>
			<name></name>
			<description></description>
			<LineString>
				<coordinates>
					<xsl:for-each select="./*[local-name() = 'coord']">
						<xsl:call-template name="coordinates"/>
					</xsl:for-each>
				</coordinates>
			</LineString>
		</Placemark>
	</xsl:template>

	<xsl:template name="coordinates">
		<xsl:call-template name="insert-comma"/>	
	</xsl:template>

	<xsl:template name="timestamp">
		<xsl:value-of select="preceding-sibling::*[1]"/>
	</xsl:template>

	<xsl:template name="insert-comma">
		<xsl:param name="pText" select="."/>
			<xsl:if test="string-length($pText)">
				<xsl:if test="not($pText=.)">, </xsl:if>
			<xsl:value-of select="substring-before(concat($pText, ' '), ' ')"/>
			<xsl:call-template name="insert-comma">
				<xsl:with-param name="pText" select="substring-after($pText, ' ')"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>