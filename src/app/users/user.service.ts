import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserLoginDto, UserRegisterDto } from './user.dto';
import { User, UserDocument } from './user.schema';
import { hash, compare } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(user: UserRegisterDto): Promise<UserDocument> {
    const { name, email, password } = user;
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new NotFoundException(`User with email ${email} already exists`);
    }
    const hashedPassword = await this._hashPassword(password);
    const newUser = new this.userModel({ name, email, password: hashedPassword });
    await newUser.save();
    return newUser;
  }

  async findAndValidateUser(userDto: UserLoginDto): Promise<UserDocument> {
    const { email, password } = userDto;
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const isMatch = await this._comparePassword(user, password);
    if (!isMatch) {
      throw new NotFoundException(`Password is incorrect`);
    }
    return user;
  }

  async findUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  private _hashPassword(password: string): Promise<string> {
    return hash(password, 12);
  }
  private _comparePassword(user: UserDocument, password: string): Promise<boolean> {
    return compare(password, user.password);
  }
}
