document.getElementById('albumForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const albumName = document.getElementById('albumName').value;
    const artistName = document.getElementById('artistName').value;
    const albumArt = document.getElementById('albumArt').value;

    const album = { albumName, artistName, albumArt };
    addAlbumToList(album);
    saveAlbumToLocalStorage(album);

    document.getElementById('albumForm').reset();
});

function addAlbumToList(album, index = null) {
    const albumList = document.getElementById('albumList');

    const albumElement = document.createElement('div');
    albumElement.className = 'album';
    albumElement.setAttribute('draggable', 'true');
    albumElement.setAttribute('data-index', index !== null ? index : albumList.children.length);

    const albumIndex = index !== null ? index + 1 : albumList.children.length + 1;

    albumElement.innerHTML = `
        <img src="${album.albumArt}" alt="${album.albumName}">
        <div>
            <strong>${album.albumName}</strong> by ${album.artistName}
        </div>
        <span>${albumIndex}</span>
    `;

    albumElement.addEventListener('dragstart', handleDragStart);
    albumElement.addEventListener('dragover', handleDragOver);
    albumElement.addEventListener('drop', handleDrop);
    albumElement.addEventListener('dragend', handleDragEnd);

    albumList.appendChild(albumElement);
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.getAttribute('data-index'));
    event.target.style.opacity = '0.4';
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event) {
    event.preventDefault();
    const draggedIndex = event.dataTransfer.getData('text/plain');
    const targetIndex = event.target.closest('.album').getAttribute('data-index');

    if (draggedIndex !== targetIndex) {
        rearrangeAlbums(draggedIndex, targetIndex);
    }
}

function handleDragEnd(event) {
    event.target.style.opacity = '1';
}

function rearrangeAlbums(draggedIndex, targetIndex) {
    const albums = getAlbumsFromLocalStorage();
    const draggedAlbum = albums.splice(draggedIndex, 1)[0];
    albums.splice(targetIndex, 0, draggedAlbum);

    localStorage.setItem('albums', JSON.stringify(albums));
    reloadAlbums();
}

function reloadAlbums() {
    const albumList = document.getElementById('albumList');
    albumList.innerHTML = '';
    loadAlbums();
}

function saveAlbumToLocalStorage(album) {
    const albums = getAlbumsFromLocalStorage();
    albums.push(album);
    localStorage.setItem('albums', JSON.stringify(albums));
}

function getAlbumsFromLocalStorage() {
    const albums = localStorage.getItem('albums');
    return albums ? JSON.parse(albums) : [];
}

function loadAlbums() {
    const albums = getAlbumsFromLocalStorage();
    albums.forEach((album, index) => addAlbumToList(album, index));
}

document.addEventListener('DOMContentLoaded', loadAlbums);
