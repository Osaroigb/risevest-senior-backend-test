import { IsNotEmpty, Length } from 'class-validator';

export class CreatePostValidationSchema {
  @IsNotEmpty()
  @Length(5, 50, { message: 'Title must be between 5 and 50 characters' })
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @Length(25, 225, { message: 'Title must be atleast 25 characters' })
  content: string;
}
