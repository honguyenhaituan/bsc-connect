import { Type } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const nestedAssign = (target: object, source: object): object => {
  Object.keys(source).forEach((sourceKey) => {
    if (
      Object.keys(target).find((targetKey) => targetKey === sourceKey) !==
        undefined &&
      typeof source[sourceKey] === 'object'
    ) {
      target[sourceKey] = nestedAssign(target[sourceKey], source[sourceKey]);
    } else {
      target[sourceKey] = source[sourceKey];
    }
  });
  return target;
};

export const readEnv = (filePaths: string[]) => {
  const env = {};
  for (const filePath of filePaths) {
    try {
      const data = yaml.load(fs.readFileSync(filePath, 'utf8'));
      nestedAssign(env, data);
    } catch (e) {}
  }

  return env;
};

export const readAndValidateEnv = (configDto: Type, filePaths: string[]) => {
  const data = readEnv(filePaths);
  const config = plainToClass(configDto, data);
  const errors = validateSync(config);
  if (errors.length > 0) {
    throw new Error(`${errors}`);
  }
  return config;
};
