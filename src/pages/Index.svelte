<script>
  import { link } from "svelte-spa-router";
</script>

<template>
  <ul class="menu">
    <!-- menu header text -->
    <li class="divider" data-content="Разделы" />
    <!-- menu item standard -->
    <li class="menu-item">
      <a use:link href="/albums">
        <i class="icon icon-link" />
        Управление альбомами
      </a>
    </li>
  </ul>
</template>
