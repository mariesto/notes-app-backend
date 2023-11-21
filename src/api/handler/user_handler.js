const autoBind = require('auto-bind');

class UserHandler {
  constructor(userService, validator) {
    this._userService = userService;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._userService.addUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'User created successfully',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;

    const user = await this._userService.getUserById(id);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UserHandler;
