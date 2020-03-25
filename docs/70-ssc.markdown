---
layout: page
title: SSC
permalink: /SSC
---

Это как CVE только для гавно-патерна. SSC-xxxxx описывает конкретную реализацию и итоги насколько дорого такое решение обходится хозяину софта.

{% for ssc_item in site.ssc %}
  <h2>
    <a href="{{ ssc_item.url }}">
      {{ ssc_item.title }}
    </a>
  </h2>
  <p>{{ ssc_item.content | markdownify }}</p>
{% endfor %}