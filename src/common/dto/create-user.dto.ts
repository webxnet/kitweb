import { Injectable } from '@nestjs/common'
import { i18nValidationMessage } from 'nestjs-i18n'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { lowercaseString, sanitizeInput } from '../helpers/utils.helper'

@Injectable()
export class CreateUserDto {
    // email
    @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
    @IsEmail({}, { message: i18nValidationMessage('validation.invalidEmail') })
    @Transform(({ value }) => {
        const newValue = sanitizeInput(value)
        return lowercaseString(newValue)
    })
    email: string

    // username
    @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
    @IsString()
    @MaxLength(25, {
        message: i18nValidationMessage('validation.maxLength', {
            type: 'string',
        }),
    })
    @MinLength(4, {
        message: i18nValidationMessage('validation.minLength', {
            type: 'string',
        }),
    })
    @Transform(({ value }) => sanitizeInput(value))
    username: string

    // password
    @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
    @IsString()
    @MaxLength(20, {
        message: i18nValidationMessage('validation.maxLength', {
            type: 'string',
        }),
    })
    @MinLength(4, {
        message: i18nValidationMessage('validation.minLength', {
            type: 'string',
        }),
    })
    //@MinLength(4, { message: 'Password should contain more than 4 characters' })
    //@MaxLength(20, { message: 'Password must be up to 20 characters' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'senha muito fraca',
    })
    password: string

    // firstName
    @IsString()
    @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
    firstName: string

    // lastName
    @IsString()
    @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
    lastName: string
}
