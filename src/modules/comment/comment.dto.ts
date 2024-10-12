import { IsNotEmpty, Length } from 'class-validator';

export class CreateCommentValidationSchema {
  @IsNotEmpty()
  @Length(5, 225, { message: 'Comment must be between 5 and 225 characters' })
  content: string;
}
