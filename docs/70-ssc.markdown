---
layout: page
title: SSC
permalink: /ssc
---

Это как CVE только для гавно-патерна. SSC-xxxxx описывает конкретную реализацию и итоги насколько дорого такое решение обходится хозяину софта.

{% for ssc_item in site.ssc %}
{% assign code_from_file_name = ssc_item.path  | remove: "_ssc/" | split: "/" | first %}
{% assign lang_from_file_name = ssc_item.path | split: "/" | last  | split: "." | first %}
{% if lang_from_file_name == 'en' %}
  <h2>
    <a href="{{ ssc_item.url }}">
      SSC-{{ code_from_file_name }}
    </a>

{% for ssc_item in site.ssc %}
{% assign ssc_item_code = ssc_item.path  | remove: "_ssc/" | split: "/" | first %}
{% if ssc_item_code == code_from_file_name %}
{% assign ssc_item_lang = ssc_item.path | split: "/" | last  | split: "." | first %}
<a href="{{ ssc_item.url }}" class="{{ ssc_item_lang }}" title="View in {{ ssc_item_lang }}">{{ site.data.languages[ssc_item_lang].icon }}</a>
{% endif %}
{% endfor %}
  </h2>
  <p>{{ ssc_item.description }}</p>
{% endif %}
{% endfor %}