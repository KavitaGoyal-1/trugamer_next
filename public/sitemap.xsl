<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 13px;
            color: #545353;
          }
          table {
            border-collapse: collapse;
          }
          table td {
            padding: 5px 10px;
            border-bottom: 1px solid #ddd;
          }
          th {
            text-align: left;
            padding-right: 30px;
            color: #7f7f7f;
          }
          thead th {
            border-bottom: 1px solid #ddd;
            padding-top: 5px;
            padding-bottom: 2px;
          }
          tbody tr:hover td, tbody tr:hover td a {
            background-color: #f3f3f3;
          }
          a, a:visited {
            color: #0181b2;
            text-decoration: none;
          }
          a:hover {
            color: #128cba;
          }
        </style>
      </head>
      <body>
        <h1>XML Sitemap </h1>
        <table cellpadding="5">
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
              <tr>
                <td>
                  <xsl:variable name="itemURL">
                    <xsl:value-of select="sitemap:loc"/>
                  </xsl:variable>
                  <a href="{$itemURL}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <xsl:value-of select="sitemap:lastmod"/>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
