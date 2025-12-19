import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(() => {
    service = {
      findOne: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    controller = new UsersController(service);
  });

  it('findOne deleguje do UsersService', async () => {
    const user = { id: 'user-1' } as User;
    service.findOne.mockResolvedValue(user);

    await expect(controller.findOne('user-1')).resolves.toBe(user);
    expect(service.findOne).toHaveBeenCalledWith('user-1');
  });

  it('update rzuca błąd, gdy edytuje inny użytkownik', async () => {
    await expect(
      controller.update('user-1', {}, { user: { id: 'other' } } as never),
    ).rejects.toThrow('Nie masz uprawnień do edycji tego użytkownika');
    expect(service.update).not.toHaveBeenCalled();
  });

  it('update deleguje do serwisu, gdy identyfikator zgodny', async () => {
    const updated = { id: 'user-1', nickname: 'new' } as User;
    service.update.mockResolvedValue(updated);

    await expect(
      controller.update('user-1', { nickname: 'new' }, { user: { id: 'user-1' } } as never),
    ).resolves.toBe(updated);
    expect(service.update).toHaveBeenCalledWith('user-1', { nickname: 'new' });
  });

  it('uploadFile aktualizuje avatar', async () => {
    const file = { filename: 'avatar.png' } as Express.Multer.File;
    const user = { id: 'user-1' } as User;
    service.update.mockResolvedValue({} as User);

    const result = await controller.uploadFile(file, user);

    expect(service.update).toHaveBeenCalledWith('user-1', { avatar: '/uploads/avatar.png' });
    expect(result).toEqual({
      message: 'file upload',
      filename: 'avatar.png',
      path: '/uploads/avatar.png',
    });
  });
});



