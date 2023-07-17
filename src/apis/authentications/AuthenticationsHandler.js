class AuthenticationsHandler {
  constructor(
    authenticationsService,
    usersService,
    tokenManager,
    authenticationsValidator
  ) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = authenticationsValidator;
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this._usersService.verifyUserCredential(
      username,
      password
    );

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);

    return h
      .response({
        status: 'success',
        message: 'Autentikasi berhasil',
        data: {
          accessToken,
          refreshToken,
        },
      })
      .code(201);
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;

    await this._authenticationsService.checkRefreshTokenExistence(refreshToken);
    const { userId } = this._tokenManager.verifyRefreshTokenSignature(refreshToken);

    const newAccessToken = this._tokenManager.generateAccessToken({ userId });

    return h
      .response({
        status: 'success',
        message: 'Access token berhasil diperbaharui',
        data: {
          accessToken: newAccessToken,
        },
      })
      .code(200);
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.checkRefreshTokenExistence(refreshToken);

    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return h
      .response({
        status: 'success',
        message: 'Autentikasi berhasil dihapus',
      })
      .code(200);
  }
}

module.exports = AuthenticationsHandler;
