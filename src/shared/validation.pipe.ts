import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RecipeDTO } from 'src/recipe/recipe.dto';
import { ValidUUID } from './helpers';

// cheack Data Transfer Object for format, completeness, etc

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {

    const { metatype, type, data } = metadata;

    // check not empty object
    if (value instanceof Object && this.isEmpty(value)) {
      throw new BadRequestException('Validation Failed: No body submitted');
    }


    // check ID param is valid
    if (type === 'param' && data === 'id' && !ValidUUID(value)) {
      throw new BadRequestException('Malformed ID');
    }

    // check for native types
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // check against known Entity class
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException(`Validation Failed: ${this.formatErrors(errors)}`);
    }
    return value;
  }

  private toValidate (metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }

  private formatErrors (errors: any): string {
    return errors.map(err => {
      for (let property in err.constraints) {
        return err.constraints[property];
      }
    }).join(', ');
  }

  private isEmpty(value: any) {
    if (Object.keys(value).length > 0) {
      return false;
    }
    return true;
  }

}
