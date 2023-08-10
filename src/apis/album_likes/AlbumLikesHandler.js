class AlbumLikesHandler {
  constructor(albumLikesService, albumsService) {
    this._albumLikesService = albumLikesService;
    this._albumsService = albumsService;
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    await this._albumsService.verifyAlbumExistence(albumId);

    const { id: userId } = request.auth.credentials;
    await this._albumLikesService.isAlbumLikedByUser(userId, albumId);

    await this._albumLikesService.addLikeAlbum(userId, albumId);

    return h
      .response({
        status: 'success',
        message: 'Album berhasil disukai.',
      })
      .code(201);
  }

  async getLikeHandler(request, h) {
    const { id: albumId } = request.params;
    await this._albumsService.verifyAlbumExistence(albumId);

    const { likes, fromCache } = await this._albumLikesService.getAlbumLikesCount(albumId);
    const response = h
      .response({
        status: 'success',
        message: 'Berhasil mendapatkan informasi jumlah penyuka album.',
        data: {
          likes,
        },
      })
      .code(200);

    if (fromCache) {
      return response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id: albumId } = request.params;
    await this._albumsService.verifyAlbumExistence(albumId);

    const { id: userId } = request.auth.credentials;
    await this._albumLikesService.deleteLikeAlbum(userId, albumId);

    return h
      .response({
        status: 'success',
        message: 'Menyukai album berhasil dibatalkan.',
      })
      .code(200);
  }
}

module.exports = AlbumLikesHandler;
