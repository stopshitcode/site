---
layout: page
title: Learning
permalink: /learning/
---
Собрать документацию(частично видео уроки) как писать качественные бизнес приложения и избегать попаданий SSC


{% for learn in site.learning %}
  <h2>
    <a href="{{ learn.url }}">
      {{ learn.title }}
    </a>
  </h2>
  <p>{{ learn.content | markdownify }}</p>
{% endfor %}