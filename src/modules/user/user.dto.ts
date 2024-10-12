import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class LoginUserValidationSchema {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 50, { message: 'Password must be at least 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    },
  )
  password: string;
}

export class CreateUserValidationSchema extends LoginUserValidationSchema {
  @IsNotEmpty()
  @Length(4, 50, { message: 'Name must be between 4 and 50 characters' })
  name: string;
}
