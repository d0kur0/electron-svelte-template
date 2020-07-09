<script>
  import { onMount } from "svelte";
  import Router, { wrap, push, location, link } from "svelte-spa-router";
  import { user } from "./stores/storesMap";

  import Index from "/pages/Index.svelte";
  import Albums from "/pages/Albums.svelte";
  import Album from "/pages/Album.svelte";

  const routes = {
    "/": Index,
    "/albums": Albums,
    "/album/:id": Album,
  };

  onMount(async () => {
    await user.auth();
  });
</script>

<style global>
  @import "../node_modules/spectre.css/dist/spectre.min.css";
  @import "../node_modules/spectre.css/dist/spectre-exp.css";
  @import "../node_modules/spectre.css/dist/spectre-icons.min.css";

  .auth-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .home {
    padding-bottom: 25px;
  }

  .card-image img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  .card-title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .card {
    margin-bottom: 10px;
  }
</style>

<template>
  {#if $location !== '/'}
    <div class="home">
      <a href="/" use:link class="btn btn-primary">
        <i class="icon icon-apps" />
        На главную
      </a>
    </div>
  {/if}

  {#if $user.isAuth}
    <Router {routes} />
  {:else}
    <div class="auth-screen">
      <div class="loading loading-lg" />
    </div>
  {/if}
</template>
