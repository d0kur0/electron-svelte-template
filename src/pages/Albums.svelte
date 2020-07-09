<script>
  import urlUtil from "/utils/url";
  import { onMount } from "svelte";
  import { user } from "/stores/storesMap";
  import { link } from "svelte-spa-router";

  let albums = [];
  let isShowModal = false;

  onMount(() => {
    const url = urlUtil({
      method: "photos.getAlbums",
      token: $user.token,
      params: {
        owner_id: $user.userId,
        need_system: "1",
        need_covers: "1",
        photo_sizes: "1",
      },
    });

    fetch(url)
      .then(r => r.json())
      .then(r => (albums = r.response.items));
  });

  const createAlbum = ({ target }) => {
    const title = target.querySelector("#name").value;
    const description = target.querySelector("#description").value;

    const url = urlUtil({
      method: "photos.createAlbum",
      token: $user.token,
      params: {
        title,
        description,
        privacy_view: "all",
        privacy_comment: "friends",
      },
    });

    fetch(url)
      .then(r => r.json())
      .then(r => (r.response ? location.reload() : alert("Ошибка создания альбома")));
  };

  const removeAlbum = album => {
    if (confirm(`Точно удалить альбом "${album.title}"? Восстановить будет невозможно.`)) {
      const url = urlUtil({
        method: "photos.deleteAlbum",
        token: $user.token,
        params: {
          album_id: album.id,
        },
      });

      fetch(url)
        .then(r => r.json())
        .then(r => (r.response ? location.reload() : alert("Ошибка удаления альбома")));
    }
  };
</script>

<style>
  .btn-group {
    margin: 20px 0;
  }
</style>

<template>
  <div class="modal modal-sm" class:active={isShowModal}>
    <div class="modal-overlay" aria-label="Close" on:click={() => (isShowModal = false)} />
    <div class="modal-container" role="document">
      <div class="modal-header">
        <button
          on:click={() => (isShowModal = false)}
          class="btn btn-clear float-right"
          aria-label="Close" />
        <div class="modal-title h5">Создание альбома</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <form id="create" on:submit={createAlbum}>
            <div class="form-group">
              <label class="form-label">Название альбома</label>
              <input class="form-input" id="name" type="text" placeholder="" />
            </div>
            <div class="form-group">
              <label class="form-label">Описание альбома</label>
              <textarea style="width: 100%" id="description" class="form-textarea" placeholder="" />
            </div>
          </form>
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" form="create" class="btn btn-primary">Создать</button>
      </div>
    </div>
  </div>

  <div class="btn-group">
    <button on:click={() => (isShowModal = true)} class="btn">Создать альбом</button>
  </div>

  <div class="columns">
    {#each albums as album}
      <div class="column col-3 col-xs-12">
        <div class="card">
          <div class="card-header">
            <div class="card-title h5">{album.title}</div>
            <div class="card-subtitle text-gray">{album.size} фотографий</div>
          </div>
          <div class="card-image">
            <img
              class="img-responsive"
              src={album.sizes[album.sizes.length - 1].src}
              alt={album.title} />
          </div>
          <div class="card-footer">
            <div>
              <a use:link href="/album/{album.id}" class="btn btn-primary">Открыть</a>
              <button on:click={() => removeAlbum(album)} class="btn btn-primary">Удалить</button>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</template>
